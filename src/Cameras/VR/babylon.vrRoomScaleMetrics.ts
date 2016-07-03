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

        public leftEyeFOVdownDegrees: number = 0;
        public leftEyeFOVleftDegrees: number = 0;
        public leftEyeFOVrightDegrees: number = 0;
        public leftEyeFOVupDegrees: number = 0;

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

        // public getLeftEyeFOV(out: Matrix): Matrix {
        public getRightEyeFOV(out: Matrix): Matrix {
          var result = this.perspectiveFromFieldOfView(
            out,
            this.leftEyeFOVupDegrees,
            this.leftEyeFOVdownDegrees,
            this.leftEyeFOVleftDegrees,
            this.leftEyeFOVrightDegrees
          );

          return result;
        }

        // public getRightEyeFOV(out: Matrix): Matrix {
        public getLeftEyeFOV(out: Matrix): Matrix {
          var result = this.perspectiveFromFieldOfView(
            out,
            this.rightEyeFOVupDegrees,
            this.rightEyeFOVdownDegrees,
            this.rightEyeFOVleftDegrees,
            this.rightEyeFOVrightDegrees
          );
          return result;
        }

        public perspectiveFromFieldOfView(out: Matrix, upDegrees: number, downDegrees: number, leftDegrees: number, rightDegrees: number): Matrix {
            var near = 0.1;
            var far = 1024.0;

            var upTan = Math.tan(this.leftEyeFOVupDegrees * Math.PI / 180.0),
                downTan = Math.tan(this.leftEyeFOVdownDegrees * Math.PI / 180.0),
                leftTan = Math.tan(this.leftEyeFOVleftDegrees * Math.PI / 180.0),
                rightTan = Math.tan(this.leftEyeFOVrightDegrees * Math.PI / 180.0),
                xScale = 2.0 / (leftTan + rightTan),
                yScale = 2.0 / (upTan + downTan);

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
        }

        public get leftHMatrix(): Matrix {
            return Matrix.Translation(this.leftEyeOffset[0], 0, 0);
        }

        public get rightHMatrix(): Matrix {
            return Matrix.Translation(this.rightEyeOffset[0], 0, 0);
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
