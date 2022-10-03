<?php
set_time_limit(0);

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
require_once '../vendor/autoload.php';

class Chat implements MessageComponentInterface {
	protected $clients; 
	//menyimpan semua client yg terhubung.
	//dihubungkan / disambungkan secaara otomatis oleh library 

	protected $clientsData = [];
	//untuk menyimpan data tambaha dari client
	//untuk bagaimana cara detachnya saya masih belum tahu?
	//ini akan menjadi catatan untuk program ini <---------

	public function __construct() {
		$this->clients = new \SplObjectStorage;
		//kurang tahu apa ini, tapi sepertinya
		//varibale cliet di definisikan sebagai
		//sebuah penyimpanan tertentu

		echo "server run in port `3000` ...\n";
	}

	public function onOpen(ConnectionInterface $conn){
		$this->clients->attach($conn);
		//menghubungkan data koneksi ke object client?
		//kurang tahu juga.
		//intinya paramter disini berupa object proxy
		//untuk data `in memory` tentang koneksi
		// $this->users[$conn->resourceId] = $conn;
	}

	public function onClose(ConnectionInterface $conn) {
		$this->clients->detach($conn);
		//ini tinggal menghapus object koneksi
		// unset($this->users[$conn->resourceId]);
	}

	public function onMessage(ConnectionInterface $from,  $data) {

		$from_id = $from->resourceId;
		$data = json_decode($data);
		$type = $data->type;
		
		var_dump($data->type);
		var_dump($data->expect);
		echo "client size before :: ".sizeof($this->clientsData)."\n";
		switch ($type) {

			//untuk admin
			case "admin":
				$from->send(
					json_encode([
						"type" => "admin_refresh",
						"data" => $data,
						"refresh_data" => $this->clientsData
					])
				);
				break;

			//menamabahkan player client sebuat id dan set local storage
			case "add_current_player":
				$id = generateRandomString(10); //dapatkan randow string untuk
				var_dump($data);
				$from->send(
					json_encode([
						"type" => "get_id",
						"client_id" => $id,
						"client_username" => $data->username
					])
				);
				break;
			

			//untuk menghubungkan pertaman kali.
			//bisa dihubungkan bila client seudah memiliki local storage
			//data client disimpan
			case 'socket' :

				//cek terlebih dahulu, apakah player masih ter attach dengan server
				//bila tidak maka tidak perlu di push ulang
				$user_id = array_column($this->clientsData, "id");
				$found_key = array_search($data->user_data->id, $user_id); 
				// var_dump($found_key);
				echo  "found key :: ".$found_key."\n" ;
				
				if(!$found_key && !($found_key === 0)){ //saya tidak tahu cara menghandle apabila keynya adalah 0
					array_push($this->clientsData, $data->user_data);
					// $this->clientsData[sizeof($this->clientsData)] = $data->user_data;
					echo "array telah ditambahkan \n";
				}
				// var_dump(sizeof($this->clientsData));
				echo "client size sudah menjadi :: ".sizeof($this->clientsData);


				//kirim ke pengirim
				$from->send(
					json_encode([
						"type" => "update",
						"get_data" => $this->clientsData[$found_key ?? sizeof($this->clientsData) - 1],
						"refresh_data" => $this->clientsData
					])
				);

				//kirim kesemua client
				foreach($this->clients as $client){
					if($from != $client){
						$client->send(
							json_encode([
								"type" => "update" ,
								"refresh_data" => $this->clientsData
							])
						);
					}
				}

				break;
			
			//untuk update
			case 'update_current_player' :
				//saya lupa fungsi kode dibawah, intinya untuk mencari array multi dimensi di php
				$user_id = array_column($this->clientsData, "id");
				$found_key = array_search($data->user_data->id, $user_id); //dapatkan index dari kolom yg dicari

				//mengubah data
				$this->clientsData[$found_key] = $data->user_data; //mengubah user target
				
				$from->send(
					json_encode([
						"type" => "update",
						"get_data" => $this->clientsData[$found_key],
						"refresh_data" => $this->clientsData
					])
				);

				//kirim kesemua client
				foreach($this->clients as $client){
					if($from != $client){
						$client->send(
							json_encode([
								"type" => "update" ,
								"refresh_data" => $this->clientsData
							])
						);
					}
				}
				break;

			//mulai semua game
			case "start_game":

				foreach ($this->clients as $client) {
					$client->send(
						json_encode([
							"type" => "start_game"
						])
					);
				}
				break;

			//untuk mendapat semua data player terbaru
			case "get_all_player":
				break;
		}

		echo "client size after :: ".sizeof($this->clientsData)."\n";
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		$conn->close();
	}
}
$server = new Ratchet\App('localhost', 3000); //gunakan port 3000
$server->route('/', new Chat, ['*']);
$server->run();

//get randow string for id
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}


## catatan 1 ##
/*
pada php terdapat nilai yang besifat false, sehingga harus berhati2 dalam melakukan operator perbandingan.
disini saya sudah merasakanya, yaitu ketika membuat perbandingan apabila element array ada atau tidak.
bila ada maka skip, bila tidak maka tambah. hal membuat saya tersita waktunya untuk mendebugging hal ini.
jadi untuk kedepanya project ini lebih diperhatikan nila yang bersifat falsynya.

*/


?>