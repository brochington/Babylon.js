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
            this.onAnimationFrame = this.onAnimationFrame.bind(this); // use () => {}?
            this._updatePosition = this._updatePosition.bind(this);
            this.inputs.addVRDisplay();
            this.rotationQuaternion = new BABYLON.Quaternion();
            console.log('rotationQuaternion', this.rotationQuaternion);
            // let vrDisplays = navigator.getVRDisplays().then(displays => {
            //   // console.log('got this far...', displays[0]);
            //   console.log(scene);
            //   if (displays.length > 0) {
            //       this._vrDisplay = displays[0];
            //       let leftEye = this._vrDisplay.getEyeParameters('left');
            //       let rightEye = this._vrDisplay.getEyeParameters('right');
            //
            //       let webglCanvas = scene.getEngine().getRenderingCanvas();
            //
            //       // console.log(leftEye, rightEye);
            //       console.log(webglCanvas);
            //       this._vrDisplay.requestPresent([{source: webglCanvas}]).then(b => {
            //         console.log('inside....',this._vrDisplay.isPresenting, b);
            //           console.log(this._vrDisplay);
            //           console.log(this._vrDisplay.getLayers());
            //           console.log(this._vrDisplay.getPose());
            //           // this._vrDisplay.requestAnimationFrame(onAnimationFrame);
            //       });
            //   }
            //
            //   function onAnimationFrame (t) {
            //     that._vrDisplay.requestAnimationFrame(onAnimationFrame);
            //     // console.log(that._vrDisplay.getPose().orientation[0]);
            //     // let leftEye = that._vrDisplay.getEyeParameters('left');
            //     // let rightEye = that._vrDisplay.getEyeParameters('right');
            //     // console.log(leftEye.fieldOfView.downDegrees);
            //   }
            // })
            // console.log('vrDisplay', navigator.getVRDisplays().then(result => console.log(result)));
        }
        // var updatePosition = (newPos) => {
        //     this._newPosition.copyFrom(newPos);
        //
        //     this._newPosition.subtractToRef(this._oldPosition, this._diffPosition);
        //
        //     var oldPosition = this.position.clone();
        //     if (this._diffPosition.length() > Engine.CollisionsEpsilon) {
        //         this.position.addInPlace(this._diffPosition);
        //         if (this.onCollide && collidedMesh) {
        //             this.onCollide(collidedMesh);
        //         }
        //     }
        // }
        VRRoomScaleCamera.prototype._updatePosition = function () {
            var oldPosition = this.position;
            var pose = this._vrDisplay.getPose();
            var position = pose.position, orientation = pose.orientation;
            this.position.x = position[0];
            this.position.y = position[1];
            this.position.z = position[2];
            this.rotationQuaternion.x = orientation[0];
            this.rotationQuaternion.y = orientation[1];
            this.rotationQuaternion.z = orientation[2];
            this.rotationQuaternion.w = orientation[3];
            this.rotationQuaternion.z *= -1;
            this.rotationQuaternion.w *= -1;
            this._vrDisplay.submitFrame(pose);
        };
        VRRoomScaleCamera.prototype.onAnimationFrame = function () {
            this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
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
                        console.log("this is vr Enabled!!");
                        console.dir(_this);
                        var renderingCanvas = _this.getEngine().getRenderingCanvas();
                        _this._vrDisplay.requestPresent([{ source: renderingCanvas }]).then(function () {
                            if (_this._vrDisplay.isPresenting) {
                                var pose = _this._vrDisplay.getPose();
                                console.log('pose', pose);
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
