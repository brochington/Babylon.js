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
            this.onAnimationFrame = this.onAnimationFrame.bind(this); // use () => {}?
            this._updatePosition = this._updatePosition.bind(this);
            this.rotationQuaternion = new BABYLON.Quaternion();
            this.minZ = -1;
            this.maxZ = 1;
            this._myViewMatrix = BABYLON.Matrix.Identity();
            this._consoleTimer = 0;
            this._hmdOrigin = new BABYLON.Vector3(0, 0, 0);
        }
        // Very slopy, but also very much a work in progress.
        VRRoomScaleCamera.prototype._updatePosition2 = function () {
            var oldPosition = this.position;
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
            this._myViewMatrix = result;
            if (this._consoleTimer % 90 === 0) {
            }
            this._vrDisplay.submitFrame(pose);
        };
        VRRoomScaleCamera.prototype.onAnimationFrame = function () {
            // Should this be moved externally to something like engine.runRenderLoop()?
            // this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
            this._updatePosition2();
            this._consoleTimer += 1;
        };
        VRRoomScaleCamera.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            if (navigator.getVRDisplays) {
                navigator.getVRDisplays().then(function (displays) {
                    if (displays.length > 0) {
                        _this._vrDisplay = displays[0];
                        _this._vrEnabled = true;
                    }
                    if (_this._vrEnabled) {
                        console.log("Engine");
                        console.dir(_this.getEngine());
                        console.log('this camera');
                        console.dir(_this);
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
            this.onAnimationFrame();
            // if (!this._localDirection) {
            //     this._localDirection = Vector3.Zero();
            //     this._transformedDirection = Vector3.Zero();
            // }
            //
            // this.inputs.checkInputs();
            _super.prototype._checkInputs.call(this);
        };
        VRRoomScaleCamera.prototype.detachControl = function (element) {
            console.log('detachControl', HTMLElement);
            _super.prototype.detachControl.call(this, element);
        };
        VRRoomScaleCamera.prototype.createRigCamera = function (name, cameraIndex) {
            var rigCamera = new BABYLON.FreeCamera(name, this.position.clone(), this.getScene());
            if (!this.rotationQuaternion) {
                this.rotationQuaternion = new BABYLON.Quaternion();
            }
            rigCamera.rotationQuaternion = new BABYLON.Quaternion();
            rigCamera._cameraRigParams = {};
            // rigCamera._cameraRigParams.vrActualUp = new Vector3(0, 0, 0);
            // rigCamera._getViewMatrix = rigCamera._getVRViewMatrix;
            return rigCamera;
        };
        VRRoomScaleCamera.prototype._updateRigCameras = function () {
            for (var i = 0; i < this._rigCameras.length; i++) {
                this._rigCameras[i].position.copyFrom(this.position);
                // Why is rotationQuaternion not present on the Camera?
                this._rigCameras[i].rotationQuaternion.copyFrom(this.rotationQuaternion);
            }
        };
        VRRoomScaleCamera.prototype._getViewMatrix = function () {
            // console.log('getViewMatrix');
            if (this._consoleTimer % 90 === 0) {
                console.log('this._myViewMatrix', this._myViewMatrix);
            }
            // return Matrix.Identity();
            return this._myViewMatrix;
        };
        // rigCamera._getViewMatrix = rigCamera._getVRViewMatrix;
        VRRoomScaleCamera.prototype.getTypeName = function () {
            return "VRRoomScaleCamera";
        };
        return VRRoomScaleCamera;
    }(BABYLON.FreeCamera));
    BABYLON.VRRoomScaleCamera = VRRoomScaleCamera;
})(BABYLON || (BABYLON = {}));
