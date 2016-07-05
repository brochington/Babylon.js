module BABYLON {
    export class VRRoomScaleCamera extends FreeCamera {
        constructor(name: string, position: Vector3, vrDisplay, scene: Scene) {
          super(name, position, scene);

          this._vrDisplay = vrDisplay;
          this.inputs.addVRDisplay();

          this._viewMatrix = Matrix.Identity();
        }

        private _vrDisplay; // VRDisplay
        public _viewMatrix = new Matrix();

        attachControl(element: HTMLElement, noPreventDefault?: boolean) {
          let renderingCanvas: HTMLCanvasElement = <HTMLCanvasElement>element;

          if (this._vrDisplay) {
            this._vrDisplay.requestPresent([{source: element }]).then(() => {
              if (this._vrDisplay.isPresenting) {
                const pose = this._vrDisplay.getPose();
                const leftEye = this._vrDisplay.getEyeParameters('left');
                const rightEye = this._vrDisplay.getEyeParameters('right');

                var metrics = new VRRoomScaleMetrics(leftEye, rightEye);

                this.setCameraRigMode(Camera.RIG_MODE_VIVE, {vrRoomScaleMetrics: metrics});
                console.log('element');
                console.dir(element);

                renderingCanvas.width = metrics.renderingWidth;
                renderingCanvas.height = metrics.renderingHeight;
              }
            })
          }
        }

        public _checkInputs(): void {
          if (!this._vrDisplay) {
            return;
          }

          const pose = this._vrDisplay.getPose();
          const {sittingToStandingTransform, sizeX, sizeZ} = this._vrDisplay.stageParameters;
          var standMatrix = Matrix.FromArray(sittingToStandingTransform);
          const {position, orientation} = pose;
          const [x, y, z] = position;

          if (position === null || orientation === null) {
            console.warn('position or orientation are null...', pose);
            return;
          }

          var result = Matrix.Compose(
            new Vector3(1, 1, 1),
            new Quaternion(orientation[0], orientation[1], (orientation[2]), (orientation[3])),
            new Vector3(x, y, z)
          );

          result = result.multiply(standMatrix);
          result = result.invert();

          this._viewMatrix = result;

          this._vrDisplay.submitFrame(pose);

          super._checkInputs();
        }

        public createRigCamera(name: string, cameraIndex: number): Camera {
            var rigCamera = new FreeCamera(name, this.position.clone(), this.getScene());

            rigCamera._cameraRigParams = {};

            return rigCamera;
        }

        public _updateRigCameras() {
          for (var i = 0; i < this._rigCameras.length; i++) {
            this._rigCameras[i]._getViewMatrix = this._getViewMatrix;
          }
        }

        public _getViewMatrix(): Matrix {
          let viewMatrix = this._viewMatrix;
          return viewMatrix;
        }

        public getTypeName(): string {
            return "VRRoomScaleCamera";
        }
    }
}
