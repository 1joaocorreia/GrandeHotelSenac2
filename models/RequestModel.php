<?php
require_once "RoomModel.php";
require_once "ReserveModel.php";

class RequestModel{

    public static function getAll($conn) {
        $sql = "SELECT * FROM pedidos";
        $result = $conn->query($sql);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function getById($conn, $id) {
        $sql = "SELECT * FROM pedidos WHERE id= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function create($conn, $data) {
        $sql = "INSERT INTO pedidos (usuario_id, cliente_id, pagamento) VALUES  (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iis",
            $data["usuario_id"],
            $data["cliente_id"],
            $data["pagamento"]
        );
        $result = $stmt->execute();
        if($result){
            return $conn->insert_id;
        }

        return false;
    }

    public static function delete($conn, $id) {
        $sql = "DELETE FROM pedidos WHERE id= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public static function update($conn ,$id ,$data) {
        $sql = "UPDATE pedidos SET usuario_id=? ,cliente_id=? ,data=? ,pagamento=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iissi",
            $data["usuario_id"],
            $data["cliente_id"],
            $data["data"],
            $data["pagamento"],
            $id
        );
        return $stmt->execute();
    }

    public static function createOrder($conn, $data) {
        $cliente_id = $data['cliente_id'];
        $pagamento = $data['pagamento'];
        $usuario_id = $data['usuario_id'];
        $reserves = [];
        $reservate = false;

        $conn->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

        try {
            $order_id = self::create($conn, [
                "cliente_id" => $cliente_id,
                "pagamento" => $pagamento,
                "usuario_id" => $usuario_id
            ]);

            if(!$order_id){
                throw new RuntimeException("Error a criar o pedido");
            }

            foreach($data['quartos'] as $quartos){
                $id = $quartos['id'];
                $inicio = $quartos['inicio'];
                $fim = $quartos['fim'];

                if(!RoomModel::lockById($conn, $id)){
                    $reserves[] = "Quarto {$id} indisponivel";
                    continue;
                }

                if(ReserveModel::getAvaibleOrder($conn, $id, $inicio, $fim)){
                    $reserves[] = "Quarto {$id} indisponivel";
                    continue;
                }   
                
                $reserverResult = ReserveModel::create($conn,[
                    "pedido_id" => $order_id,
                    "quarto_id" => $id,
                    "adicional_id" => null,
                    "fim" => $fim,
                    "inicio" => $inicio,
                ]);

                if($reserverResult){
                    $reservate = true;
                    $reserves[] = [
                        "reserva_id" => $conn->insert_id,
                        "quarto_id" => $id
                    ];
                }
            }
            if ($reservate) {
                $conn->commit();
                return [
                    "pedido_id" => $order_id,
                    "reservas" => $reserves,
                    "messagem" => "Reservas criadas com sucesso!!"
                ];
            } else {
                throw new RuntimeException("Pedido nao realizado, nenhum quarto reservado");
            }
        }catch (\Throwable $th){
            try{$conn->rollback();} catch(\Throwable $th2){}
            
            throw $th;
        }
    }
}
?>