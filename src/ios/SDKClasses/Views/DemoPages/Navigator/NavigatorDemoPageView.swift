import SwiftUI
import DGis

struct NavigatorDemoView: View {
    @Binding var isPresented: Bool
    @Binding var parentIsPresented: Bool
    
	private enum Constants {
		static let offset: CGFloat = 10
		static let buttonSize: CGFloat = 44
		static let pickerHeight: CGFloat = 44
		static let pickerWidth: CGFloat = 150
	}

	@Environment(\.colorScheme) var colorScheme
	@Environment(\.presentationMode) private var presentationMode
	@ObservedObject private var viewModel: NavigatorDemoViewModel
	private let viewFactory: DemoPageComponentsFactory

	init(
		viewModel: NavigatorDemoViewModel,
		viewFactory: DemoPageComponentsFactory
	) {
		self.viewModel = viewModel
		self.viewFactory = viewFactory
        self._isPresented = .constant(false)
        self._parentIsPresented = .constant(false)
	}
    
    init(
        viewModel: NavigatorDemoViewModel,
        viewFactory: DemoPageComponentsFactory,
        isPresented: Binding<Bool>,
        parentIsPresented: Binding<Bool>
    ) {
        self.viewModel = viewModel
        self.viewFactory = viewFactory
        self._isPresented = isPresented
        self._parentIsPresented = parentIsPresented
    }

	var body: some View {
		ZStack {
			self.viewFactory.makeNavigatorView(
				navigationManager: self.viewModel.navigationManager,
				roadEventCardPresenter: self.viewModel.roadEventCardPresenter,
				onCloseButtonTapped: { [self] in
					print(">>> CLOSE <<<")
                    
                    //ENVIAR CALLBACK de navegação concluída?
                    self.stopNavigation()
				},
				onMapTapped: { location in
					self.viewModel.tap(location)
				},
				onMapLongPressed: { location in
					self.viewModel.longPress(location)
				}
			)
			.id(self.viewModel.mapId)

			if self.viewModel.showTargetPointPicker {
				self.targetPointSearchOverlay()
			}

			if self.viewModel.showRouteSearchMessage {
				Text("Route search...")
				.fontWeight(.bold)
			}
			if self.viewModel.isStopNavigationButtonVisible {
				VStack(alignment: .leading) {
					Spacer()
					HStack {
						self.closeButton()
						Spacer()
					}
					.padding([.leading, .bottom], 20)
				}
			}
		}
		.edgesIgnoringSafeArea(.all)
		.onDisappear {
			self.viewModel.stopNavigation()
		}
		.navigationBarHidden(true)
		.navigationBarTitle("")
		.alert(isPresented: self.$viewModel.isErrorAlertShown) {
			Alert(title: Text(self.viewModel.errorMessage ?? ""))
		}
		.actionSheet(item: self.$viewModel.request, content: { request in
			switch request {
				case .routeSelection(let trafficRoutes):
					return self.routeSelectionActionSheet(trafficRoutes)
				case .addIntermediatePoint(let point):
					return self.addIntermediatePointActionSheet(point)
			}
		})
	}

	private func targetPointSearchOverlay() -> some View {
		NavigatorTargetPointSearchOverlayView(
			viewModel: self.viewModel.navigatorSettingsViewModel,
			startNavigationCallback: {
				[weak viewModel = self.viewModel] in
				viewModel?.state = .targetPointSearch
				viewModel?.startNavigation()
			},
			restoreNavigationCallback: {
				[weak viewModel = self.viewModel] in
				viewModel?.restoreNavigation()
			}
		)
	}

	private func closeButton() -> some View {
        //AQUI Sai da View!!!
		return Button.makeCircleButton(iconName: "xmark") {
            self.stopNavigation()
            self.presentationMode.wrappedValue.dismiss()

            self.isPresented = false
            self.parentIsPresented = false
		}
	}

	private func routeSelectionActionSheet(_ routes: [TrafficRoute]) -> ActionSheet {
		var buttons: [ActionSheet.Button] = routes.map { route in
			ActionSheet.Button.default(Text("\(route.description)")) {
				self.viewModel.select(route: route)
			}
		}
		buttons.append(
			.cancel {
				self.stopNavigation()
			}
		)
		return ActionSheet(
			title: Text("Which route will we take?"),
			buttons: buttons
		)
	}

	private func addIntermediatePointActionSheet(_ routePoint: RouteSearchPoint) -> ActionSheet {
		return ActionSheet(
			title: Text("Add an intermediate point?"),
			buttons: [
				.default(Text("Submit")) {
					self.viewModel.addIntermediatePoint(routePoint: routePoint)
				},
				.cancel {
					self.viewModel.cancelAddIntermediatePoint()
				}
			]
		)
	}

	private func stopNavigation() {
		self.viewModel.saveState()
		self.viewModel.stopNavigation()
	}
}
