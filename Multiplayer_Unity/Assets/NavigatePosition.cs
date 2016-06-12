// This script is attached to the player

using UnityEngine;
using System.Collections;


public class NavigatePosition : MonoBehaviour {
	NavMeshAgent agent;

	void Start () {
		agent = GetComponent<NavMeshAgent> ();  // The component NavMeshAgent ist also attached to the player
	}

	public void NavigateTo (Vector3 position) {
		agent.SetDestination (position);
	}
}
