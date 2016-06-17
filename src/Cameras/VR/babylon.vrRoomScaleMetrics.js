var BABYLON;
(function (BABYLON) {
    var VRRoomScaleMetrics = (function () {
        function VRRoomScaleMetrics(leftEye, rightEye) {
            this.compensateDistortion = true;
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
