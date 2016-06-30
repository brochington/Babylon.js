module BABYLON {
    export class VRRoomScaleCamera extends FreeCamera {
        constructor(name: string, position: Vector3, scene: Scene, compensateDistortion = true) {
          super(name, position, scene);

          this.inputs.addVRDisplay();

          this.onAnimationFrame = this.onAnimationFrame.bind(this); // use () => {}?
          this._updatePosition = this._updatePosition.bind(this);
          this.rotationQuaternion = new Quaternion();

          this.minZ = -1;
          this.maxZ = 1;

          this._myViewMatrix = Matrix.Identity();

          this._consoleTimer = 0;

          this._hmdOrigin = new Vector3(0, 0, 0);
        }

        private _vrDisplay; // VRDisplay
        private _vrEnabled; // bool
        public _myViewMatrix : Matrix;
        private _consoleTimer;
        private _hmdOrigin;

        // Very slopy, but also very much a work in progress.
        _updatePosition2() {
          const oldPosition = this.position;
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

          this._myViewMatrix = result;

          if (this._consoleTimer % 90 === 0) {
            // console.log('result', result);
            // console.log(pose);
            // console.log(workMatrix2);
            // console.log(invertedWorkMatrix);
          }

          this._vrDisplay.submitFrame(pose);
        }

        onAnimationFrame() {
          // Should this be moved externally to something like engine.runRenderLoop()?
          this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
          this._updatePosition2();
          this._consoleTimer += 1;
        }

        attachControl(element: HTMLElement, noPreventDefault?: boolean) {
          if (navigator.getVRDisplays) {
            navigator.getVRDisplays().then(displays => {
              if (displays.length > 0) {
                this._vrDisplay = displays[0];
                this._vrEnabled = true;
              }

              if (this._vrEnabled) {
                console.log("Engine");
                console.dir(this.getEngine());
                console.log('this camera');
                console.dir(this);

                const renderingCanvas = this.getEngine().getRenderingCanvas();

                this._vrDisplay.requestPresent([{source: renderingCanvas }]).then(() => {
                  if (this._vrDisplay.isPresenting) {
                    // reset position and pose.
                    // this._vrDisplay.resetPose();
                    // this.position = new Vector3(0, 3, 0);
                    const pose = this._vrDisplay.getPose();
                    console.log('pose', pose);
                    const leftEye = this._vrDisplay.getEyeParameters('left');
                    const rightEye = this._vrDisplay.getEyeParameters('right');
                    console.log(leftEye, rightEye);

                    // setting up camera rig here so that we can get eye parameter
                    // data into the metrics.
                    var metrics = new VRRoomScaleMetrics(leftEye, rightEye);
                    console.log('metrics 2', metrics);
                    this.setCameraRigMode(Camera.RIG_MODE_VIVE, {vrRoomScaleMetrics: metrics});
                    // Will need to update camera rigs with eye parameters

                    renderingCanvas.width = metrics.renderingWidth;
                    renderingCanvas.height = metrics.renderingHeight;

                    // this._hmdOrigin = new Vector3(pose.position[0], pose.position[1], pose.position[2]);

                    console.log("_hmdOrigin", this._hmdOrigin);

                    this._vrDisplay.requestAnimationFrame(this.onAnimationFrame);
                  }
                })
              }
            });
          }
        }

        detachControl(element: HTMLElement) {
          console.log('detachControl', HTMLElement);
          super.detachControl(element);
        }

        public createRigCamera(name: string, cameraIndex: number): Camera {
            var rigCamera = new FreeCamera(name, this.position.clone(), this.getScene());

            if (!this.rotationQuaternion) {
              this.rotationQuaternion = new Quaternion();
            }

            rigCamera.rotationQuaternion = new Quaternion();
            rigCamera._cameraRigParams = {};
            // rigCamera._cameraRigParams.vrActualUp = new Vector3(0, 0, 0);
            // rigCamera._getViewMatrix = rigCamera._getVRViewMatrix;

            return rigCamera;
        }

        public _updateRigCameras() {
          for (var i = 0; i < this._rigCameras.length; i++) {
            this._rigCameras[i].position.copyFrom(this.position);
            // Why is rotationQuaternion not present on the Camera?
            this._rigCameras[i].rotationQuaternion.copyFrom(this.rotationQuaternion);
            // console.log(this._rigCameras[i].rotationQuaternion);
            // console.log(this._rigCameras[i].cameraDirection);
            // Why does minZ and maxZ seem to break things?
              // this._rigCameras[i].minZ = this.minZ;
              // this._rigCameras[i].maxZ = this.maxZ;
              // this._rigCameras[i].fov = this.fov;
          }
        }

        public _getViewMatrix(): Matrix {
          // console.log('getViewMatrix');
          if (this._consoleTimer % 90 === 0) {

            console.log('this._myViewMatrix', this._myViewMatrix);
          }
          // return Matrix.Identity();
          return this._myViewMatrix;
        }

        // rigCamera._getViewMatrix = rigCamera._getVRViewMatrix;

        public getTypeName(): string {
            return "VRRoomScaleCamera";
        }
    }
}
