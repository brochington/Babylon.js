var BABYLON;
(function (BABYLON) {
    var VRRoomScaleMetrics = (function () {
        function VRRoomScaleMetrics(leftEye, rightEye) {
            this.compensateDistortion = true;
            this.leftEyeFOVdownDegrees = 0;
            this.leftEyeFOVleftDegrees = 0;
            this.leftEyeFOVrightDegrees = 0;
            this.leftEyeFOVupDegrees = 0;
            this.leftEyeFOVdownDegrees = leftEye.fieldOfView.downDegrees;
            this.leftEyeFOVleftDegrees = leftEye.fieldOfView.leftDegrees;
            this.leftEyeFOVrightDegrees = leftEye.fieldOfView.rightDegrees;
            this.leftEyeFOVupDegrees = leftEye.fieldOfView.upDegrees;
            this.rightEyeFOVdownDegrees = rightEye.fieldOfView.downDegrees;
            this.rightEyeFOVleftDegrees = rightEye.fieldOfView.leftDegrees;
            this.rightEyeFOVrightDegrees = rightEye.fieldOfView.rightDegrees;
            this.rightEyeFOVupDegrees = rightEye.fieldOfView.upDegrees;
            this.leftEyeOffset = leftEye.offset;
            this.rightEyeOffset = rightEye.offset;
            this.leftEyeRenderHeight = leftEye.renderHeight;
            this.leftEyeRenderWidth = leftEye.renderWidth;
            this.rightEyeRenderHeight = rightEye.renderHeight;
            this.rightEyeRenderWidth = rightEye.renderWidth;
        }
        Object.defineProperty(VRRoomScaleMetrics.prototype, "aspectRatio", {
            get: function () {
                return this.leftEyeRenderHeight / (2 * this.leftEyeRenderWidth);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VRRoomScaleMetrics.prototype, "aspectRatioFov", {
            get: function () {
                return (2 * Math.atan((this.postProcessScaleFactor * this.vScreenSize) / (2 * this.eyeToScreenDistance)));
            },
            enumerable: true,
            configurable: true
        });
        VRRoomScaleMetrics.prototype.getLeftEyeFOV = function (out) {
            var result = this.perspectiveFromFieldOfView(out, this.leftEyeFOVupDegrees, this.leftEyeFOVdownDegrees, this.leftEyeFOVleftDegrees, this.leftEyeFOVrightDegrees);
            return result;
        };
        VRRoomScaleMetrics.prototype.getRightEyeFOV = function (out) {
            var result = this.perspectiveFromFieldOfView(out, this.rightEyeFOVupDegrees, this.rightEyeFOVdownDegrees, this.rightEyeFOVleftDegrees, this.rightEyeFOVrightDegrees);
            return result;
        };
        VRRoomScaleMetrics.prototype.perspectiveFromFieldOfView = function (out, upDegrees, downDegrees, leftDegrees, rightDegrees) {
            var near = 0.1;
            var far = 1024.0;
            var upTan = Math.tan(this.leftEyeFOVupDegrees * Math.PI / 180.0), downTan = Math.tan(this.leftEyeFOVdownDegrees * Math.PI / 180.0), leftTan = Math.tan(this.leftEyeFOVleftDegrees * Math.PI / 180.0), rightTan = Math.tan(this.leftEyeFOVrightDegrees * Math.PI / 180.0), xScale = 2.0 / (leftTan + rightTan), yScale = 2.0 / (upTan + downTan);
            out.m[0] = xScale;
            out.m[1] = 0.0;
            out.m[2] = 0.0;
            out.m[3] = 0.0;
            out.m[4] = 0.0;
            out.m[5] = yScale;
            out.m[6] = 0.0;
            out.m[7] = 0.0;
            out.m[8] = -((leftTan - rightTan) * xScale * 0.5);
            out.m[9] = ((upTan - downTan) * yScale * 0.5);
            out.m[10] = far / (near - far);
            out.m[11] = -1.0;
            out.m[12] = 0.0;
            out.m[13] = 0.0;
            out.m[14] = (far * near) / (near - far);
            out.m[15] = 0.0;
            return out;
        };
        Object.defineProperty(VRRoomScaleMetrics.prototype, "leftHMatrix", {
            get: function () {
                var meters = (this.hScreenSize / 4) - (this.lensSeparationDistance / 2);
                var h = (4 * meters) / this.hScreenSize;
                return BABYLON.Matrix.Translation(h, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VRRoomScaleMetrics.prototype, "rightHMatrix", {
            get: function () {
                var meters = (this.hScreenSize / 4) - (this.lensSeparationDistance / 2);
                var h = (4 * meters) / this.hScreenSize;
                return BABYLON.Matrix.Translation(-h, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VRRoomScaleMetrics.prototype, "leftPreViewMatrix", {
            get: function () {
                return BABYLON.Matrix.Translation(0.5 * this.interpupillaryDistance, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VRRoomScaleMetrics.prototype, "rightPreViewMatrix", {
            get: function () {
                return BABYLON.Matrix.Translation(-0.5 * this.interpupillaryDistance, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VRRoomScaleMetrics.prototype, "renderingHeight", {
            get: function () {
                return Math.max(this.leftEyeRenderHeight, this.rightEyeRenderHeight);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VRRoomScaleMetrics.prototype, "renderingWidth", {
            get: function () {
                return Math.max(this.leftEyeRenderWidth, this.rightEyeRenderWidth) * 2;
            },
            enumerable: true,
            configurable: true
        });
        return VRRoomScaleMetrics;
    }());
    BABYLON.VRRoomScaleMetrics = VRRoomScaleMetrics;
})(BABYLON || (BABYLON = {}));
