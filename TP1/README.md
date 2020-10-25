# LAIG 2020/2021 - TP1

## Group: T02G01

| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Ana Teresa Cruz  | 201806460 | up201806460@fe.up.pt |
| André Nascimento | 201806461 | up201806461@fe.up.pt |

----
## Project information

- Scene
  - A cena consiste num pátio com piscina, uma mesa com 2 cadeiras almofadadas, um guarda-sol, um baloiço e uma bóia.
  - [Link relativo para a cena](./scenes/LAIG_TP1_T2_G01.xml)

- Main strong point: Parser

	O parser do ficheiro XML (MySceneGraph.js), ao qual dedicamos a maior parte do tempo, faz o tratamento da grande maioria dos erros, evitando ao máximo parar a execução do programa. Das verificações aplicadas destacamos:

	- Verificação de todos os valores retirados do XML;
	- No caso do node ter um campo 'id' e este for null ignoramos esse node;
	- Criação de uma camara (*view*) default em caso de erro no campo default da tag view ou nenhuma view declarada;
	- Valores default para as componentes *ambient* e *background* da *illumination* em caso de erro;
	- Criação de uma luz default caso não haja nenhuma luz definida;
	- Criação de uma textura default aplicada em caso de erros associados a texturas nos nodes;
	- Criação de um material default aplicado em caso de erros associados a materiais nos nodes;