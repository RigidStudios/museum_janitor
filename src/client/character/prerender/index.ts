import { Position } from "./position";
import { Rotation } from "./rotation";
import { Input } from "./input";
import { RunService } from "@rbxts/services";

const START_POSITION = new Vector3(0, 0, 0);
const START_ROTATION = new CFrame(0, 0, 0);

export class PreRender {
	private readonly _position: Position = new Position(START_POSITION);
	private readonly _rotation: Rotation = new Rotation(START_ROTATION);
	private readonly _input: Input = new Input();
	private readonly _connection: RBXScriptConnection;

	constructor() {
		this._connection = RunService.Heartbeat.Connect((dt) => {
			this._input.update(dt);
			const updatedRotation: CFrame = this._rotation.update(this._input.getRotationDirection().mul(dt));
			const localMovement: Vector3 = updatedRotation.PointToObjectSpace(this._input.getMoveDirection().mul(dt));
			this._position.update(localMovement);
		});
	}

	public destroy(): void {
		this._connection.Disconnect();
	}

	public position(): Vector3 {
		return this._position.getPosition();
	}

	public rotation(): CFrame {
		return this._rotation.getRotation();
	}

	public breatheOffset(): Vector3 {
		return this._position.getBreatheOffset();
	}
}