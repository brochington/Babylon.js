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
            // var positionVector = new Vector(x, y, z);
            workMatrix = this.fromRotationTranslation(workMatrix, orientation, position);
            workMatrix = BABYLON.Matrix.FromArray(workMatrix);
            workMatrix = workMatrix.multiply(standMatrix);
            // const temp = this._hmdOrigin.subtractFromFloats(x, y, z);
            // this.position = temp;
            // this.position.x = x;
            this.position.y = workMatrix.toArray()[13];
            // this.position.z = z;
            // this.position.x = ((temp.x + 1) / (2 / sizeX));
            // this.position.addInPlace(temp);
            // this.position.y = position[1];
            // this.position.z = position[2];
            // this.position.x = ((position[0] + 1) / (2 / sizeX));
            // this.position.y = position[1];
            // this.position.z = ((position[2] + 1) / (2 / sizeZ)); // needs to be -
            if (this._consoleTimer % 20 === 0) {
                console.log("HMD location", position);
                // console.log('temp', temp, this.position, orientation);
                console.log('workMatrix', workMatrix, this.position);
            }
            //
            // var myMatrix = Matrix.Compose(
            //   new Vector3(0, 0, 0),
            //   new Quaternion(orientation[0], orientation[1], (orientation[2]), (orientation[3])),
            //   new Vector3(0, 3, 0)
            // );
            // if (this._consoleTimer % 20 === 0) {
            //   console.log('myMatrix', myMatrix);
            // }
            // Matrix.multiplyToRef(sittingToStandingTransform, myMatrix);
            // myMatrix.multiplyToRef(standMatrix, myMatrix);
            // var orientationMatrix = Matrix.FromArray
            // this._viewMatrix = workMatrix;
            // console.log(myMatrix);
            this.rotationQuaternion.x = orientation[0];
            this.rotationQuaternion.y = orientation[1];
            this.rotationQuaternion.z = orientation[2];
            this.rotationQuaternion.w = orientation[3];
            // this.position.addInPlace(this.cameraDirection);
            this.rotationQuaternion.z *= -1;
            this.rotationQuaternion.w *= -1;
            // console.time('tempPoseMatrix');
            // let tempPoseMatrix = Matrix.Identity();
            // console.timeEnd('tempPoseMatrix');
            // console.log("before", tempPoseMatrix);
            // console.dir(Matrix.FromArray(sittingToStandingTransform));
            // this.fromRotationTranslation(tempPoseMatrix, orientation, position);
            // let newPoseMatrix = new Matrix();
            // console.log('after', tempPoseMatrix.multiply(standMatrix));
            // tempPoseMatrix = tempPoseMatrix.multiply(standMatrix);
            // this.viewMatrix = tempPoseMatrix;
            // this.rotationQuaternion = this.rotationQuaternion.fromRotationMatrix(tempPoseMatrix);
            // console.dir(this.rotationQuaternion.fromRotationMatrix(tempPoseMatrix));
            // this.renderSceneView(this._vrDisplay.getEyeParameters('left'));
            // this.renderSceneView(this._vrDisplay.getEyeParameters('right'));
            // console.log(this.getViewMatrix());
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
                                _this._vrDisplay.resetPose();
                                _this.position = new BABYLON.Vector3(0, 3, 0);
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
