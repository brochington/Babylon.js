module BABYLON {
    export class VRRoomScaleCamera extends FreeCamera {
        constructor(name: string, position: Vector3, scene: Scene, compensateDistortion = true) {
          super(name, position, scene);
        }

        public getTypeName(): string {
            return "VRRoomScaleCamera";
        }
    }
}
