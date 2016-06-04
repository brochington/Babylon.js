var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BABYLON;
(function (BABYLON) {
    var VRRoomScaleCamera = (function (_super) {
        __extends(VRRoomScaleCamera, _super);
        function VRRoomScaleCamera(name, position, scene, compensateDistortion) {
            var _this = this;
            if (compensateDistortion === void 0) { compensateDistortion = true; }
            _super.call(this, name, position, scene);
            var that = this;
            this.inputs.addVRDisplay();
            var vrDisplays = navigator.getVRDisplays().then(function (displays) {
                // console.log('got this far...', displays[0]);
                console.log(scene);
                if (displays.length > 0) {
                    _this._vrDisplay = displays[0];
                    var leftEye = _this._vrDisplay.getEyeParameters('left');
                    var rightEye = _this._vrDisplay.getEyeParameters('right');
                    var webglCanvas = scene.getEngine().getRenderingCanvas();
                    // console.log(leftEye, rightEye);
                    console.log(webglCanvas);
                    _this._vrDisplay.requestPresent([{ source: webglCanvas }]).then(function (b) {
                        console.log('inside....', _this._vrDisplay.isPresenting, b);
                        console.log(_this._vrDisplay);
                        console.log(_this._vrDisplay.getLayers());
                        console.log(_this._vrDisplay.getPose());
                        // this._vrDisplay.requestAnimationFrame(onAnimationFrame);
                    });
                }
                function onAnimationFrame(t) {
                    that._vrDisplay.requestAnimationFrame(onAnimationFrame);
                    // console.log(that._vrDisplay.getPose().orientation[0]);
                    // let leftEye = that._vrDisplay.getEyeParameters('left');
                    // let rightEye = that._vrDisplay.getEyeParameters('right');
                    // console.log(leftEye.fieldOfView.downDegrees);
                }
            });
            // console.log('vrDisplay', navigator.getVRDisplays().then(result => console.log(result)));
        }
        VRRoomScaleCamera.prototype.getTypeName = function () {
            return "VRRoomScaleCamera";
        };
        return VRRoomScaleCamera;
    }(BABYLON.FreeCamera));
    BABYLON.VRRoomScaleCamera = VRRoomScaleCamera;
})(BABYLON || (BABYLON = {}));
