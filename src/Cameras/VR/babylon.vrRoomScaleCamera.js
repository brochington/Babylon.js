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
            var that = this;
            this.setCameraRigMode(BABYLON.Camera.RIG_MODE_VIVE, {});
            this.onAnimationFrame = this.onAnimationFrame.bind(this); // use () => {}?
            this._updatePosition = this._updatePosition.bind(this);
            this.inputs.addVRDisplay();
            this.rotationQuaternion = new BABYLON.Quaternion();
            this.poseMatrix = new BABYLON.Matrix();
            this.viewMatrix = new BABYLON.Matrix();
            console.log('rotationQuaternion', this.rotationQuaternion);
        }
        // stolen from http://glmatrix.net/docs/mat4.js.html#line1449
        VRRoomScaleCamera.prototype.fromRotationTranslation = function (out, q, v) {
            // Quaternion math
            var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            out[0] = 1 - (yy + zz);
            out[1] = xy + wz;
            out[2] = xz - wy;
            out[3] = 0;
            out[4] = xy - wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz + wx;
            out[7] = 0;
            out[8] = xz + wy;
            out[9] = yz - wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            return out;
        };
        VRRoomScaleCamera.prototype.renderSceneView = function (eye) {
        };
        VRRoomScaleCamera.prototype._updatePosition = function () {
            console.log('_updatePosition');
            console.log('_rigCameras');
            console.log(this._rigCameras);
            var oldPosition = this.position;
            var pose = this._vrDisplay.getPose();
            var position = pose.position, orientation = pose.orientation;
            this.position.x = position[0]; // need to take into account height
            this.position.y = position[1];
            this.position.z = position[2];
            this.rotationQuaternion.x = orientation[0];
            this.rotationQuaternion.y = orientation[1];
            this.rotationQuaternion.z = orientation[2];
            this.rotationQuaternion.w = orientation[3];
            this.rotationQuaternion.z *= -1;
            this.rotationQuaternion.w *= -1;
            this.fromRotationTranslation(this.poseMatrix, orientation, position);
            this.renderSceneView(this._vrDisplay.getEyeParameters('left'));
            this.renderSceneView(this._vrDisplay.getEyeParameters('right'));
            this._vrDisplay.submitFrame(pose);
        };
        VRRoomScaleCamera.prototype.onAnimationFrame = function () {
            // this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
            this._updatePosition();
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
                        var renderingCanvas_1 = _this.getEngine().getRenderingCanvas();
                        _this._vrDisplay.requestPresent([{ source: renderingCanvas_1 }]).then(function () {
                            if (_this._vrDisplay.isPresenting) {
                                var pose = _this._vrDisplay.getPose();
                                console.log('pose', pose);
                                var leftEye = _this._vrDisplay.getEyeParameters('left');
                                var rightEye = _this._vrDisplay.getEyeParameters('right');
                                // console.log('eyes..', leftEye, rightEye);
                                renderingCanvas_1.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
                                renderingCanvas_1.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
                                _this._vrDisplay.requestAnimationFrame(_this.onAnimationFrame);
                            }
                        });
                    }
                });
            }
            // window.addEventListener("deviceorientation", this._deviceOrientationHandler);
        };
        VRRoomScaleCamera.prototype.detachControl = function (element) {
            console.log('detachControl', HTMLElement);
            // window.removeEventListener("deviceorientation", this._deviceOrientationHandler);
        };
        VRRoomScaleCamera.prototype.getTypeName = function () {
            return "VRRoomScaleCamera";
        };
        return VRRoomScaleCamera;
    }(BABYLON.FreeCamera));
    BABYLON.VRRoomScaleCamera = VRRoomScaleCamera;
})(BABYLON || (BABYLON = {}));
