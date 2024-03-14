//
//  UrbiMaps.swift
//  UrbiMaps
//
//  Created by OutSystems on 12/03/2024.
//

import SwiftUI
import UrbiViewController;

@objc(UrbiMaps)
class UrbiMaps: CDVPlugin {
    var hostingViewController: UIViewController?
    private let logger: ILogger = Logger()

    class Logger : ILogger {
        func logMessage(_ message: String, level: UrbiViewController.LogLevel) {
            print("UrbiMaps logger: ", level, message);
        }
    }
    
    @objc(openMap:)
    func openMap(command: CDVInvokedUrlCommand){
        let urbiMapsView = UrbiView(logger: self.logger)
        let hostingViewController = UIHostingController(rootView: urbiMapsView)
        hostingViewController.modalPresentationStyle = .fullScreen
        
        self.viewController.present(hostingViewController, animated: true, completion: nil)
        
        let result = CDVPluginResult(status: CDVCommandStatus_OK)
        self.commandDelegate.send(result, callbackId: command.callbackId)
    }
    
    @objc(openMapWithFinishPoint:)
    func openMapWithFinishPoint(command: CDVInvokedUrlCommand){

        guard let arguments = command.arguments,
            arguments.count >= 2,
            let latitude = command.arguments[0] as? Double,
            let longitude = command.arguments[1] as? Double,
            let objId = command.arguments[2] as? UInt64 else {
                let result = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "One of more parameters failed. Check latitude, longitude and the optional objId")
                self.commandDelegate.send(result, callbackId: command.callbackId)
                return;
            }
        let urbiMapsView = UrbiView(logger: self.logger)
            .latitudeFinishPoint(latitude)
            .longitudeFinishPoint(longitude)
            .objIdFinishPoint(objId);
        
        let hostingViewController = UIHostingController(rootView: urbiMapsView)
        hostingViewController.modalPresentationStyle = .fullScreen
        
        self.viewController.present(hostingViewController, animated: true, completion: nil)
        
        let result = CDVPluginResult(status: CDVCommandStatus_OK)
        self.commandDelegate.send(result, callbackId: command.callbackId)
        
    }
}
