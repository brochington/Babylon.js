var BABYLON;
(function (BABYLON) {
    var FreeCameraVRDisplayInput = (function () {
        function FreeCameraVRDisplayInput() {
            console.log("inside a constructor");
        }
        FreeCameraVRDisplayInput.prototype.attachControl = function (element, noPreventDefault) {
            console.log('attachControl element', HTMLElement);
            // window.addEventListener("deviceorientation", this._deviceOrientationHandler);
        };
        FreeCameraVRDisplayInput.prototype.detachControl = function (element) {
            console.log('detachControl', HTMLElement);
            // window.removeEventListener("deviceorientation", this._deviceOrientationHandler);
        };
        FreeCameraVRDisplayInput.prototype.getTypeName = function () {
            return "FreeCameraVRDisplayInput";
        };
        FreeCameraVRDisplayInput.prototype.getSimpleName = function () {
            return "VRDisplay";
        };
        return FreeCameraVRDisplayInput;
    }());
    BABYLON.FreeCameraVRDisplayInput = FreeCameraVRDisplayInput;
    BABYLON.CameraInputTypes["FreeCameraVRDisplayInput"] = FreeCameraVRDisplayInput;
})(BABYLON || (BABYLON = {}));
