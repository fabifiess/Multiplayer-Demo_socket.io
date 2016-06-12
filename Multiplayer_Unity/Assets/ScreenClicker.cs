// This script is attached to the camera

using UnityEngine;
using System.Collections;

public class ScreenClicker : MonoBehaviour {


	void Update () {
		if (Input.GetButtonDown ("Fire2")) {
			Clicked ();
		};
	}

	void Clicked(){
		Ray ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		RaycastHit hit = new RaycastHit ();
		if (Physics.Raycast (ray, out hit)) {
			Debug.Log (hit.collider.gameObject.name);

			var clickMove = hit.collider.gameObject.GetComponent<ClickMove> (); // ClickMove is attached to the floor
			clickMove.OnClick (hit.point);
		}
	}
}
