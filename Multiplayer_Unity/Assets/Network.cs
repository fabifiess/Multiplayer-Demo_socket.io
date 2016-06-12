using UnityEngine;
using System.Collections;
using SocketIO;

public class Network : MonoBehaviour {

	static SocketIOComponent socket;
	public GameObject playerPrefab;

	void Start () {
		socket = GetComponent<SocketIOComponent> ();
		socket.On ("open", OnConnected); // on the new client
		socket.On ("spawn", OnSpawned);  // on all clients
	}

	//  will be executed only this the new client as soon as it is connected
	void OnConnected(SocketIOEvent e){
		Debug.Log ("connected");
		socket.Emit ("move");
	}

	// whenever a client connects, every connected player will execute this function
	void OnSpawned(SocketIOEvent e){
		Debug.Log ("Instantiate new player");
		Instantiate (playerPrefab);
	}
}