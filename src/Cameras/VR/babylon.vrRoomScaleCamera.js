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
            if (compensateDistortion === void 0) { compensateDistortion = true; }
            _super.call(this, name, position, scene);
            this.inputs.addVRDisplay();
            this._viewMatrix = BABYLON.Matrix.Identity();
        }
        VRRoomScaleCamera.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            if (navigator.getVRDisplays) {
                navigator.getVRDisplays().then(function (displays) {
                    if (displays.length > 0) {
                        // Right now this is only handling the first display,
                        // But handling of additional displays should be added.
                        _this._vrDisplay = displays[0];
                        _this._vrEnabled = true;
                    }
                    if (_this._vrEnabled) {
                        var renderingCanvas_1 = _this.getEngine().getRenderingCanvas();
                        _this._vrDisplay.requestPresent([{ source: renderingCanvas_1 }]).then(function () {
                            if (_this._vrDisplay.isPresenting) {
                                var pose = _this._vrDisplay.getPose();
                                var leftEye = _this._vrDisplay.getEyeParameters('left');
                                var rightEye = _this._vrDisplay.getEyeParameters('right');
                                // setting up camera rig here so that we can get eye parameter
                                // data into the metrics.
                                var metrics = new BABYLON.VRRoomScaleMetrics(leftEye, rightEye);
                                _this.setCameraRigMode(BABYLON.Camera.RIG_MODE_VIVE, { vrRoomScaleMetrics: metrics });
                                // Will need to update camera rigs with eye parameters
                                renderingCanvas_1.width = metrics.renderingWidth;
                                renderingCanvas_1.height = metrics.renderingHeight;
                            }
                        });
                    }
                });
            }
        };
        VRRoomScaleCamera.prototype._checkInputs = function () {
            if (!this._vrDisplay) {
                return;
            }
            var pose = this._vrDisplay.getPose();
            var _a = this._vrDisplay.stageParameters, sittingToStandingTransform = _a.sittingToStandingTransform, sizeX = _a.sizeX, sizeZ = _a.sizeZ;
            var standMatrix = BABYLON.Matrix.FromArray(sittingToStandingTransform);
            var position = pose.position, orientation = pose.orientation;
            var x = position[0], y = position[1], z = position[2];
            if (position === null || orientation === null) {
                console.warn('position or orientation are null...', pose);
                return;
            }
            var result = BABYLON.Matrix.Compose(new BABYLON.Vector3(1, 1, 1), new BABYLON.Quaternion(orientation[0], orientation[1], (orientation[2]), (orientation[3])), new BABYLON.Vector3(x, y, z));
            result = result.multiply(standMatrix);
            result = result.invert();
            this._viewMatrix = result;
            this._vrDisplay.submitFrame(pose);
            _super.prototype._checkInputs.call(this);
        };
        VRRoomScaleCamera.prototype.createRigCamera = function (name, cameraIndex) {
            var rigCamera = new BABYLON.FreeCamera(name, this.position.clone(), this.getScene());
            rigCamera._cameraRigParams = {};
            return rigCamera;
        };
        VRRoomScaleCamera.prototype._updateRigCameras = function () {
            for (var i = 0; i < this._rigCameras.length; i++) {
                this._rigCameras[i]._getViewMatrix = this._getViewMatrix;
            }
        };
        VRRoomScaleCamera.prototype._getViewMatrix = function () {
            return this._viewMatrix;
        };
        VRRoomScaleCamera.prototype.getTypeName = function () {
            return "VRRoomScaleCamera";
        };
        return VRRoomScaleCamera;
    }(BABYLON.FreeCamera));
    BABYLON.VRRoomScaleCamera = VRRoomScaleCamera;
})(BABYLON || (BABYLON = {}));
