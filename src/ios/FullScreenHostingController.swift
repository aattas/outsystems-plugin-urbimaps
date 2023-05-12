//
//  FullScreenHostingController.swift
//  MyAPP11
//
//  Created by Andre Grillo on 10/05/2023.
//
//   For iOS 13 compatibility 

import SwiftUI

class FullScreenHostingController: UIHostingController<AnyView> {
    override init(rootView: AnyView) {
        super.init(rootView: rootView)
        self.modalPresentationStyle = .fullScreen
    }
    
    @objc required dynamic init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension UIViewController {
    func toPresentedView(isPresented: Binding<Bool>) -> some View {
        return PresentedViewModifier(isPresented: isPresented, viewController: self)
    }
}

struct PresentedViewModifier: View {
    @Binding var isPresented: Bool
    let viewController: UIViewController
    
    var body: some View {
        EmptyView()
            .onAppear {
                self.viewController.present(self.viewController, animated: true, completion: nil)
                self.isPresented = true
            }
    }
}
