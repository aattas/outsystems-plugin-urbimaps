//
//  UrbiMaps.swift
//  UrbiMaps
//
//  Created by Andre Grillo on 10/04/2023.
//

import SwiftUI
import DGis

@objc(UrbiMaps)
class UrbiMaps: CDVPlugin {
    var hostingViewController: UIViewController?
    lazy var container = Container()
           
    @objc(openMap:)
    func openMap(command: CDVInvokedUrlCommand){
        let searchView = self.container.makeSearchStylesDemoPage()
        let hostingViewController = UIHostingController(rootView: searchView)
        hostingViewController.modalPresentationStyle = .fullScreen
        self.viewController.present(hostingViewController, animated: true, completion: nil)
    }
}
