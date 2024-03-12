package com.outsystems.plugin.urbimaps

import ae.urbi.partners.neom.GoActivity
import ae.urbi.partners.neom.Latitude
import ae.urbi.partners.neom.Longitude
import ae.urbi.partners.neom.ObjId
import android.content.Intent
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaInterface
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.CordovaWebView
import org.json.JSONArray

private const val ACTION_OPEN_MAPS = "openMap"
private const val ACTION_OPEN_MAPS_WITH_FINISH_POINT = "openMapWithFinishPoint"

class UrbiMaps : CordovaPlugin() {

  override fun initialize(cordova: CordovaInterface?, webView: CordovaWebView?) {
    super.initialize(cordova, webView)
  }

  override fun execute(action: String, args: JSONArray, callbackContext: CallbackContext): Boolean {
    try {
      if (ACTION_OPEN_MAPS == action) {
        try {
          openMap()
          callbackContext.success()
        } catch (e:Exception){
          callbackContext.error("An error occurred starting the map: " + e.message);
        }
        return true;
      } else if (ACTION_OPEN_MAPS_WITH_FINISH_POINT == action) {
        try {
          var lat: Double = args.getDouble(0);
          val long: Double = args.getDouble(1);
          val objId: Long = args.getLong(2);
          openMapWithFinishPoint(lat, long, objId);
          callbackContext.success()
        } catch (e:Exception){
          callbackContext.error("An error occurred starting the map: " + e.message);
        }
        return true;
      } else {
        callbackContext.error("Action $action not found!")
      }
    } catch (ex: Exception) {
        callbackContext.error(ex.message)
    }

    return true
  }

  private fun openMapWithFinishPoint(lat: Double, lon: Double, objId: Long){
    val it: Intent = GoActivity.Companion.prepareIntent(this.cordova.context, Latitude(lat), Longitude(lon), ObjId(objId)).also {
      // Could be some activity or application class
      this.cordova.context.startActivity(it)
    }
  }

  private fun openMap(){
    val it: Intent = GoActivity.Companion.prepareIntent(this.cordova.context).also {
      // Could be some activity or application class
      this.cordova.context.startActivity(it)
    }
  }
}