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
            this.myPosX = 0;
            this.myPosY = 0;
            this.myPosZ = 0;
            this.inputs.addVRDisplay();
            this.onAnimationFrame = this.onAnimationFrame.bind(this); // use () => {}?
            this._updatePosition = this._updatePosition.bind(this);
            this.rotationQuaternion = new BABYLON.Quaternion();
            this.minZ = -1;
            this.maxZ = 1;
            this._viewMatrix = BABYLON.Matrix.Identity();
            this._consoleTimer = 0;
            this._hmdOrigin = new BABYLON.Vector3(0, 0, 0);
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
        VRRoomScaleCamera.prototype.perspective = function (out, fovy, aspect, near, far) {
            var f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
            out[0] = f / aspect;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = f;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = (far + near) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = (2 * far * near) * nf;
            out[15] = 0;
            return out;
        };
        VRRoomScaleCamera.prototype.renderSceneView = function (eye) {
        };
        VRRoomScaleCamera.prototype._updatePosition2 = function () {
            var oldPosition = this.position;
            var pose = this._vrDisplay.getPose();
            var _a = this._vrDisplay.stageParameters, sittingToStandingTransform = _a.sittingToStandingTransform, sizeX = _a.sizeX, sizeZ = _a.sizeZ;
            var standMatrix = BABYLON.Matrix.FromArray(sittingToStandingTransform);
            var position = pose.position, orientation = pose.orientation;
            var x = position[0], y = position[1], z = position[2];
            // var sst = Matrix.FromArray(sittingToStandingTransform);
            if (position === null || orientation === null) {
                console.warn('position or orientation are null...', pose);
                return;
            }
            var workMatrix = BABYLON.Matrix.Identity().toArray();
            // corrent...
            var invertedWorkMatrix = BABYLON.Matrix.Identity();
            workMatrix = this.fromRotationTranslation(workMatrix, orientation, position);
            var workMatrix2 = BABYLON.Matrix.FromArray(Array.prototype.slice.call(workMatrix));
            workMatrix2 = workMatrix2.multiply(standMatrix);
            workMatrix2.invertToRef(invertedWorkMatrix);
            var workMatrix2Arr = workMatrix2.toArray();
            //
            // this.position.x = workMatrix2Arr[12] * sizeX;
            // this.position.y = workMatrix2Arr[13];
            // this.position.z = workMatrix2Arr[14] * sizeZ * -1;
            // this.position.x = workMatrix2Arr[12] * (sizeX * 0.5);
            this.position.x = workMatrix2Arr[12] * (sizeX * 0.5);
            this.position.y = workMatrix2Arr[13];
            this.position.z = workMatrix2Arr[14] * (sizeZ * 0.5) * -1;
            // this.position.x = this.myPosX;
            // this.position.x = this.myPosX;
            // this.position.y = this.myPosY;
            // this.position.z = this.myPosZ;
            // this.position.y = 1;
            // this.position.z = sizeZ * -1;
            if (this._consoleTimer % 20 === 0) {
            }
            //
            // var myMatrix = Matrix.Compose(
            //   new Vector3(0, 0, 0),
            //   new Quaternion(orientation[0], orientation[1], (orientation[2]), (orientation[3])),
            //   new Vector3(0, 3, 0)
            // );
            // this.rotationQuaternion = this.rotationQuaternion.fromRotationMatrix(workMatrix2);
            this.rotationQuaternion.x = orientation[0];
            this.rotationQuaternion.y = orientation[1];
            this.rotationQuaternion.z = orientation[2];
            this.rotationQuaternion.w = orientation[3];
            this.rotationQuaternion.z *= -1;
            this.rotationQuaternion.w *= -1;
            this._vrDisplay.submitFrame(pose);
        };
        VRRoomScaleCamera.prototype.onAnimationFrame = function () {
            // Should this be moved externally to something like engine.runRenderLoop()?
            this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
            this._updatePosition2();
            this._consoleTimer += 1;
        };
        //
        // public _checkInputs(): void {
        //   super._checkInputs();
        // }
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
                                // reset position and pose.
                                // this._vrDisplay.resetPose();
                                // this.position = new Vector3(0, 3, 0);
                                var pose = _this._vrDisplay.getPose();
                                console.log('pose', pose);
                                var leftEye = _this._vrDisplay.getEyeParameters('left');
                                var rightEye = _this._vrDisplay.getEyeParameters('right');
                                console.log(leftEye, rightEye);
                                // setting up camera rig here so that we can get eye parameter
                                // data into the metrics.
                                var metrics = new BABYLON.VRRoomScaleMetrics(leftEye, rightEye);
                                console.log('metrics 2', metrics);
                                _this.setCameraRigMode(BABYLON.Camera.RIG_MODE_VIVE, { vrRoomScaleMetrics: metrics });
                                // Will need to update camera rigs with eye parameters
                                renderingCanvas_1.width = metrics.renderingWidth;
                                renderingCanvas_1.height = metrics.renderingHeight;
                                // this._hmdOrigin = new Vector3(pose.position[0], pose.position[1], pose.position[2]);
                                console.log("_hmdOrigin", _this._hmdOrigin);
                                _this._vrDisplay.requestAnimationFrame(_this.onAnimationFrame);
                            }
                        });
                    }
                });
            }
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
            // console.log('_getVRViewMatrix.....');
            return this._viewMatrix;
            // return Matrix.Identity();
        };
        // rigCamera._getViewMatrix = rigCamera._getVRViewMatrix;
        VRRoomScaleCamera.prototype.getTypeName = function () {
            return "VRRoomScaleCamera";
        };
        return VRRoomScaleCamera;
    }(BABYLON.FreeCamera));
    BABYLON.VRRoomScaleCamera = VRRoomScaleCamera;
})(BABYLON || (BABYLON = {}));
