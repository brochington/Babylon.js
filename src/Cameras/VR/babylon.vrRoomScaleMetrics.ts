module BABYLON {
    export class VRRoomScaleMetrics {
        public hResolution: number;
        public vResolution: number;
        public hScreenSize: number;
        public vScreenSize: number;
        public vScreenCenter: number;
        public eyeToScreenDistance: number;
        public lensSeparationDistance: number;
        public interpupillaryDistance: number;
        public distortionK: number[];
        public chromaAbCorrection: number[];
        public postProcessScaleFactor: number;
        public lensCenterOffset: number;
        public compensateDistortion = true;

        public leftEyeFOVdownDegrees: number;
        public leftEyeFOVleftDegrees: number;
        public leftEyeFOVrightDegrees: number;
        public leftEyeFOVupDegrees: number;

        public rightEyeFOVdownDegrees: number;
        public rightEyeFOVleftDegrees: number;
        public rightEyeFOVrightDegrees: number;
        public rightEyeFOVupDegrees: number;

        public leftEyeOffset: Float32Array;
        public rightEyeOffset: Float32Array;

        public leftEyeRenderHeight: number;
        public leftEyeRenderWidth: number;

        public rightEyeRenderHeight: number;
        public rightEyeRenderWidth: number;

        constructor(leftEye, rightEye) {
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

        public get aspectRatio(): number {
            return this.leftEyeRenderHeight / (2 * this.leftEyeRenderWidth);
        }

        public get aspectRatioFov(): number {
            return (2 * Math.atan((this.postProcessScaleFactor * this.vScreenSize) / (2 * this.eyeToScreenDistance)));
        }

        public get leftHMatrix(): Matrix {
            var meters = (this.hScreenSize / 4) - (this.lensSeparationDistance / 2);
            var h = (4 * meters) / this.hScreenSize;

            return Matrix.Translation(h, 0, 0);
        }

        public get rightHMatrix(): Matrix {
            var meters = (this.hScreenSize / 4) - (this.lensSeparationDistance / 2);
            var h = (4 * meters) / this.hScreenSize;

            return Matrix.Translation(-h, 0, 0);
        }

        public get leftPreViewMatrix(): Matrix {
            return Matrix.Translation(0.5 * this.interpupillaryDistance, 0, 0);
        }

        public get rightPreViewMatrix(): Matrix {
            return Matrix.Translation(-0.5 * this.interpupillaryDistance, 0, 0);
        }

        public get renderingHeight(): number {
            return Math.max(this.leftEyeRenderHeight, this.rightEyeRenderHeight);
        }

        public get renderingWidth(): number {
            return Math.max(this.leftEyeRenderWidth, this.rightEyeRenderWidth) * 2;
        }
      }
  }
