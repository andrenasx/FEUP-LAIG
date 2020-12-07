%game_over(+GameState, +Size, +Player, -Winner)
/*
Check victory from the current player first (last round enemy)
*/
game_over(GameState, Size, Player, Player):-
    checkWinner(Player, GameState, Size, 0, 0).

/*
Check victory from the current enemy after
*/
game_over(GameState, Size, Player, Enemy):-
    Enemy is -Player,
    checkWinner(Enemy, GameState, Size, 0, 0).

%checkWinner(+Player, +GameState, +Size, +Row, +Column)
/*
Check if red player (1) won (there is a path linking left side to right side),
using checkHorizontalPath to avaliate board after floodfill
*/
checkWinner(1, GameState, Size, Row, Column):-
    Row < Size,
    tryFloodFill(GameState, Size, Row, Column, FinalGameState),
    FinalCol is Size-1,
    checkHorizontalPath(FinalGameState, 0, FinalCol).

/*
If FloodFill try or checkHorizontalPath failed check next row
*/
checkWinner(1, GameState, Size, Row, Column):-
    Row < Size,
    NextRow is Row + 1,
    checkWinner(1, GameState, Size, NextRow, Column).

/*
Check if blue player (-1) won,
transposing GameState matrix and using checkWinner/5 for red player (1) to check for a path on transposed matrix
*/
checkWinner(-1, GameState, Size, Row, Column):-
    transpose(GameState, Transposed),
    checkWinner(1, Transposed, Size, Row, Column).

%tryFloodFill(+Matrix, +Size, +Row, +Column, +FinalMatrix)    
/*
If given position is an empty space (0),
floodfill the matrix replacing empty spaces(0) with '?'(2)
Returns in FinalMatrix the floodfilled matrix
*/
tryFloodFill(Matrix, Size, Row, Column, FinalMatrix):-
    getValueFromMatrix(Matrix, Row, Column, 0),
    floodFill(Matrix, Size, Row, Column, 0, 2, FinalMatrix), !.

%getValueFromMatrix(+Matrix, +Row, +Column, -Value)
/*
Gets Value in given Row and Column of the Matrix
*/
getValueFromMatrix(Matrix, Row, Column, Value) :-
	nth0(Row, Matrix, RowList),
	nth0(Column, RowList, Value).

%floodFill(+Matrix, +Size, +Row, +Column, +PreviousCharacter, +NewCharacter, -FinalMatrix)
/*
A recursive function to replace 
PreviousCharacter at position (Row, Column)
and all surrounding pixels of position
with NewCharacter.
Returns in FinalMatrix the floodfilled matrix
*/
floodFill(Matrix, Size, Row, Column, PrevC, NewC, FinalMatrix):-
    Row >= 0, Row < Size, Column >= 0, Column < Size,
    getValueFromMatrix(Matrix, Row, Column, PrevC),
    replaceInMatrix(Matrix, Row, Column, NewC, UpdatedMatrix),
    Row1 is Row+1, Row2 is Row-1, Col1 is Column+1, Col2 is Column-1,
    floodFill(UpdatedMatrix, Size, Row1, Column, PrevC, NewC, M1) ,
    floodFill(M1, Size, Row2, Column, PrevC, NewC, M2) ,
    floodFill(M2, Size, Row, Col1, PrevC, NewC, M3) , 
    floodFill(M3, Size, Row, Col2, PrevC, NewC, FinalMatrix).

/*
If previous predicate failed because position is out of matrix boundaries 
or char in the current position isn't previous char
returns the given Matrix
*/
floodFill(Matrix, _, _, _, _, _, Matrix).

%replaceInMatrix(+Matrix, +Row, +Column, +Value, -FinalMatrix)
/*
Replaces Value in given Row and Column of the Matrix
*/
replaceInMatrix(Matrix, Row, Column, Value, FinalMatrix) :-
	nth0(Row, Matrix, RowsList),
	replaceInList(Column, RowsList, Value, NewRows),
	replaceInList(Row, Matrix, NewRows, FinalMatrix).

%replaceInList(+Index, +List, +Element, -NewList)
/*
Replaces an element in a List at a specified Index with Element
*/
replaceInList(Index, List, Element, NewList) :-
	nth0(Index, List, _, Rest),
	nth0(Index, NewList, Element, Rest).

%choose_move(+GameState, +Size, +Player, +PlayerType, -Move)
/*
Selects a piece and a position to move if there are available moves for the player,
returning the move selected
*/
choose_move(GameState, Size, Player, 'Player', [SelectedPosition, MovePosition]):-
    valid_moves(GameState, Size, Player, _),
    selectPiecePosition(GameState, Size, Player, SelectedPosition),
    movePiecePosition(GameState, Size, Player, SelectedPosition, MovePosition).

/*
If no available moves then select a piece to remove, returning the move selected
*/
choose_move(GameState, Size, Player, 'Player', SelectedPosition):-
    removePiecePosition(GameState, Size, Player, SelectedPosition).

%valid_moves(+GameState, +Size, +Player, -ListOfMoves)
/*
Gets all the possible moves for all the current pieces of the given player
Returns a list with all the possible moves for the player (as [[SelectedRow-SelectedColumn, MoveRow-MoveColumn], ...])
*/
valid_moves(GameState, Size, Player, ListOfMoves):-
    getPlayerInMatrix(GameState, Size, Player, Positions),
    getAllPossibleMoves(GameState, Size, Player, Positions, ListOfMoves),
    \+isEmpty(ListOfMoves).

/*
If list is empty, write proper message error and fail predicate
*/
valid_moves(_, _, _, _):-
    write('\nNo moves available, remove your own piece\n'), fail.

%getPlayerInMatrix(+GameState,+Size,+Player,-ListOfPositions)
/*
Retuns on ListOfMoves the all the positions where exists a current player's piece
*/
getPlayerInMatrix(GameState, Size, Player, ListOfPositions) :-
	getPlayerInMatrix(GameState, Size, 0, 0, Player, [], ListOfPositions), !.

%Base case, when the position is Row=8 Column=0, it stops (end of the board)
getPlayerInMatrix(_, Size, Row, Column, _, ListOfPositions, ListOfPositions):-
	checkEndPosition(Row, Column, Size).

%If it is the player is that cell, then append that position and pass to the next position
getPlayerInMatrix(GameState, Size, Row, Column, Player, ListInterm, ListOfPositions):-
	getValueFromMatrix(GameState, Row, Column, Player),
	append(ListInterm, [Row-Column], NewList),
	nextPosition(Row, Column, Size, NextRow, NextColumn),
	getPlayerInMatrix(GameState, Size, NextRow, NextColumn, Player, NewList, ListOfPositions).

%If it is not the player in that cell, avance to the next position
getPlayerInMatrix(GameState, Size, Row, Column, Player, ListInterm, ListOfPositions):-
	nextPosition(Row, Column, Size, NextRow, NextColumn),
	getPlayerInMatrix(GameState, Size, NextRow, NextColumn, Player, ListInterm, ListOfPositions).

%checkEndPosition(+Row,+Column,+Size)
/*
If the row is equal to size, then the board's end was reached
*/
checkEndPosition(Row, Column, Size):-
	Row is Size, Column is 0.

%nextPosition(+Row,+Column,+Size,-NextRow,-NextColumn)
/*
If the end of the column has not been reached, avance to the next collumn, remaining in the same row
*/
nextPosition(Row, Column, Size, Row, NextColumn):-
    NextColumn is Column + 1,
    NextColumn \== Size.
	
%nextPosition(+Row,+Column,+Length,-NextRow,-NextColumn)
/*
If the end of the column has been reached, avance to the next row, starting in the first column(0)
*/
nextPosition(Row, Column, Size, NextRow, 0):-
    NextColumn is Column + 1,
    NextColumn == Size,
    NextRow is Row + 1.

getAllPossibleMoves(GameState, Size, Player, Positions, ListOfPossibleMoves):-
	getAllPossibleMoves(GameState, Size, Player, Positions, [], ListOfPossibleMoves).

getAllPossibleMoves(_, _, _, [], ListOfPossibleMoves, ListOfPossibleMoves).
getAllPossibleMoves(GameState, Size, Player, [Row-Column|PosRest], ListInterm, ListOfPossibleMoves):-
	checkMove(GameState, Size, Row, Column, Player, Moves),
	appendMoves(Row-Column, Moves, CurrentMoves),
	appendNotEmpty(ListInterm, CurrentMoves, NewList),
	getAllPossibleMoves(GameState, Size, Player, PosRest, NewList, ListOfPossibleMoves), !.

%checkMove(+GameState, +Size, +SelectedRow, +SelectedColumn, +Player, -ListOfMoves)
/*
Checks all surrounding orthogonal positions from the given position
Returns a list with all the possible moves for that piece (as [MoveRow1-MoveColumn1, ...])
*/
checkMove(GameState, Size, SelRow, SelColumn, Player, ListOfMoves) :-
    checkDownMove(GameState, Size, SelRow, SelColumn, Player, DownMove),
    checkUpMove(GameState, Size, SelRow, SelColumn, Player, UpMove),
    checkLeftMove(GameState, Size, SelRow, SelColumn, Player, LeftMove),
    checkRightMove(GameState, Size, SelRow, SelColumn, Player, RightMove),
    appendNotEmpty([], DownMove, L),
    appendNotEmpty(L, UpMove, L1),
    appendNotEmpty(L1, LeftMove, L2),
    appendNotEmpty(L2, RightMove, ListOfMoves), !.

checkUpMove(GameState, _, Row, Col, Player, UpMove):-
    Row>0, NewRow is Row-1,
    isEnemy(GameState, NewRow, Col, Player),
    UpMove = [NewRow-Col].

checkUpMove(_, _, _, _, _, []).

checkDownMove(GameState, Size, Row, Col, Player, DownMove):-
    Row<Size, NewRow is Row+1,
    isEnemy(GameState, NewRow, Col, Player),
    DownMove = [NewRow-Col].

checkDownMove(_, _, _, _, _, []).

checkLeftMove(GameState, _, Row, Col, Player, LeftMove):-
    Col>0, NewCol is Col-1,
    isEnemy(GameState, Row, NewCol, Player),
    LeftMove = [Row-NewCol].

checkLeftMove(_, _, _, _, _, []).

checkRightMove(GameState, Size, Row, Col, Player, RightMove):-
    Col<Size, NewCol is Col+1,
    isEnemy(GameState, Row, NewCol, Player),
    RightMove = [Row-NewCol].

checkRightMove(_, _, _, _, _, []).

%isEnemy(+Board,+Row,+Column,+Player)
/*
Checks if board value in the given position (row and column) is the current player's enemy
*/
isEnemy(Board, Row, Column, Player) :-
    getValueFromMatrix(Board, Row, Column, Enemy),
    Enemy is -Player.

%appendMoves(+Pos,+Moves,-RetList)
/*
Return on RetList a list of sublists with for each position moves like [PositionRow-PosionColumn, MoveRow-MoveColumn], ...]
*/
appendMoves(_, [], []).
appendMoves(Pos, Moves, RetList):-
	appendMoves(Pos, Moves, [], RetList).

appendMoves(_, [], RetList, RetList).
appendMoves(Pos, [Move | T], AuxList, RetList):-
	CompleteMove = [Pos, Move],
	append([CompleteMove], AuxList, NewAuxList),
	appendMoves(Pos, T, NewAuxList, RetList).

%appendNotEmpty(+L1,+L2,-L12)
/*
If given L2 list is not empty, append it to L1 and result is L12
Base case, if L2 is an empty list then the result is L1
*/
appendNotEmpty(L1, [], L1).
appendNotEmpty(L1, L2, L12):-
	append(L1, L2, L12).

%isEmpty(+List)
/*
Checks if List is empty
*/
isEmpty([]).

%readRow(+Row)
/*
Reads Row input code, ignoring newlines (ascii code 10)
*/
readRow(Row) :-
    write('  -> Row    '),
    get_code(Row),
    Row\=10.

%readColumn(+Column)
/*
Reads Column input code, ignoring newlines (ascii code 10)
*/
readColumn(Column) :-
    write('  -> Column '),
    get_code(Column),
    Column\=10.

%validateRow(+RowInput,-NewRow,+Size)
/*
Checks if the row input is valid by calculating it's index, converting ascii code to number, being the first row A with index 0
ascii code for A is 65; ascii code for a is 97
the index has to be within the limits of the board
the next char has to be a newline (else 2 chars in input, thus failing)
*/
validateRow(RowInput, NewRow, Size) :-
    peek_char('\n'),
    (
        (   %upper case letter
            RowInput < 97,
            NewRow is RowInput - 65
        );
        (   %lower case letter
            RowInput >= 97,
            NewRow is RowInput - 97
        )
    ),
    Valid is Size-1,
    between(0, Valid, NewRow),
    skip_line.

%validateRow(+RowInput,-NewRow,+Size)
/*
If the verification above fails, then it outputs a error message and the user is asked for a new input
*/
validateRow(_, _, _) :-
    write('\n! That row is not valid. Choose again !\n\n'), skip_line, fail.

%validateColumn(+ColumnInput,-NewColumn,+Size)
/*
Checks if the column input is valid by calculating it's index, converting ascii code to number, being the first collumn 1 index 0
the index has to be within the limits of the board
the next char has to be a newline (else 2 chars in input, thus failing)
*/
validateColumn(ColumnInput, NewColumn, Size) :-
    peek_char('\n'),
    NewColumn is ColumnInput - 49,
    Valid is Size-1,
    between(0, Valid, NewColumn),
    skip_line.

%validateColumn(+ColumnInput,-NewColumn,+Size)
/*
If the verification above fails, then it outputs a error message and the user is asked for a new input
*/
validateColumn(_, _, _) :-
    write('\n! That column is not valid. Choose again !\n\n'), skip_line, fail.

%manageRow(-NewRow, +Size)
/*
Reads the input Row and checks if it is between the limits of the board
*/
manageRow(NewRow, Size) :-
    repeat,
    readRow(Row),
    validateRow(Row, NewRow, Size).

%manageColumn(-NewColumn,+Size)
/*
Reads the input Column and checks if it is between the limits of the board
*/
manageColumn(NewColumn, Size) :-
    repeat,
    readColumn(Column),
    validateColumn(Column, NewColumn, Size).

%manageInputs(-NewRow,-NewColumn,+Size)
/*
Reads and checks both row and column inputs
*/
manageInputs(NewRow, NewColumn, Size) :-
    manageRow(NewRow, Size),
    manageColumn(NewColumn, Size), !.

%selectPiecePosition(+Board,+Size,+Player,-SelectedPosition)
/*
The player selects the piece he wants to move
the inputs are checked if they are within the boundaries of the board,
if the player is selecting his own piece,
and if there are any move possible for that piece
*/
selectPiecePosition(Board, Size, Player, SelectedRow-SelectedColumn):-
    repeat,
    write('\nSelect piece:\n'),
    manageInputs(SelectedRow, SelectedColumn, Size),
    validateContent(Board, Size, SelectedRow-SelectedColumn, Player).

%movePiecePosition(+Board,+Size,+Player,+SelectedPosition,-MovePosition)
/*
The player selects the position for the piece he wants to move
the inputs are checked if they are within the boundaries of the board,
and if the movement is valid
*/
movePiecePosition(Board, Size, Player, SelectedRow-SelectedColumn, MoveRow-MoveColumn):-
    repeat,
    write('\nMove to:\n'),
    manageInputs(MoveRow, MoveColumn, Size),
    verifyOrtMove(Board, Player, SelectedRow-SelectedColumn, MoveRow-MoveColumn).

%removePiecePosition(+Board,+Size,+Player,-SelectedPosition)
/*
The player selects the piece to be removed
the inputs are checked if they are within the boundaries of the board,
and if the players selects their own piece
*/
removePiecePosition(Board, Size, Player, SelectedRow-SelectedColumn):-
    repeat,
    write('\nRemove piece:\n'),
    manageInputs(SelectedRow, SelectedColumn, Size),
    verifyPlayer(Board, SelectedRow-SelectedColumn, Player).

%validateContent(+Board, +Size, +SelectedPosition, +Player)
/*
Checks if piece in the selected position is valid: 
verifies if it is a piece from the given player
and if the piece has any possible moves
*/
validateContent(Board, Size, SelectedRow-SelectedColumn, Player):-
    verifyPlayer(Board, SelectedRow-SelectedColumn, Player), !,
    verifyPossibleMove(Board, Size, SelectedRow-SelectedColumn, Player, _).

%verifyPlayer(+Board, +SelectedPosition, +Player)
/*
Verifies if the player is selecting his own piece
*/
verifyPlayer(Board, SelectedRow-SelectedColumn, Player):-
    getValueFromMatrix(Board, SelectedRow, SelectedColumn, Player).

/*
If not, write proper message error and fail predicate
*/
verifyPlayer(_, _, _):-
    write('\n! That is not your piece. Choose again !\n'), fail.

%verifyPossibleMove(+GameState, +Size, +SelectedPosition, +Player, -ListOfMoves)
/*
Verifies if piece in the given position has any possible moves
*/
verifyPossibleMove(GameState, Size, SelectedRow-SelectedColumn, Player, ListOfMoves):-
    checkMove(GameState, Size, SelectedRow, SelectedColumn, Player, ListOfMoves),
    \+isEmpty(ListOfMoves).

/*
If list is empty, write proper message error and fail predicate
*/
verifyPossibleMove(_, _, _, _, _):-
    write('\n! No available moves for that piece. Choose again !\n'), fail.


%verifyOrtMove(+SelBoard, +Player, +SelectedPosition, +MovePosition)
/*
check if the player is moving his piece correctly
the movements must be orthogonal
when the movement is within the same row, the player can only select the position immediately to the right or left
when the movement is within the same column, the player can only select the position immediately to the top or down
*/
verifyOrtMove(SelBoard, Player, SelRow-SelColumn, MoveRow-MoveColumn) :-
    isEnemy(SelBoard, MoveRow, MoveColumn, Player),
    (
        (MoveRow=:=SelRow, (MoveColumn=:=SelColumn+1 ; MoveColumn=:=SelColumn-1));  /*Same row*/
        (MoveColumn=:=SelColumn, (MoveRow=:=SelRow+1 ; MoveRow=:=SelRow-1)) /*Same column */
    ).

/*
If not, write proper message error and fail predicate
*/
verifyOrtMove(_, _, _, _):-
    write('\n! That is not a valid move. Choose again !\n'), fail.

%move(+GameState, +Player, +Move, -NewGameState)
/*
Move when available moves (and in this case Move is [SelectedRow-SelectedColumn, MoveRow-MoveColumn]),
replacing on board the selected position with empty space and moving position with player piece,
returning the board after the move
*/
move(GameState, Player, Move, NewGameState):-
    getSelAndMovePosition(Move, SelRow-SelColumn, FinalRow-FinalColumn),
    replaceInMatrix(GameState, SelRow, SelColumn, 0, UpdatedGameState),
    replaceInMatrix(UpdatedGameState, FinalRow, FinalColumn, Player, NewGameState).

/*
Move when no available moves (and in this case Move is SelectedRow-SelectedColumn),
replacing selected position on board with empty space,
returning the board after the remove
*/
move(GameState, _, Row-Column, NewGameState):-
    replaceInMatrix(GameState, Row, Column, 0, NewGameState).

%getSelAndMovePosition(+Move,-SelPosition,-MovPosition)
/*
Returns the current and the moving positions
*/
getSelAndMovePosition(Move, SelPosition, MovPosition):-
	nth0(0, Move, SelPosition),
	nth0(1, Move, MovPosition).


