// This script is attached to the floor

using UnityEngine;
using System.Collections;

public class ClickMove : MonoBehaviour {

	public GameObject player;


	public void OnClick (Vector3 position) {
		NavigatePosition navPos = player.GetComponent<NavigatePosition> ();  // The component NavigatePosition is attached to the player
		navPos.NavigateTo (position);
	}
}
