%game_over(+GameState, +Size, +Player, -Winner)
/*
Check victory from the current enemy
*/
game_over(GameState, Size, Player, Enemy):-
    Enemy is -Player,
    checkWinner(Enemy, GameState, Size, 0, 0).

/*
Check victory from the current player
*/
game_over(GameState, Size, Player, Player):-
    checkWinner(Player, GameState, Size, 0, 0).

game_over(_,_,_,0).

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


%checkHorizontalPath(+GameState, +Row, +FinalCol)
/*
Check if there is a floodfill replaced char in the final column, meaning a path for the red player
*/
checkHorizontalPath(GameState, Row, FinalCol):-
    Row =< FinalCol,
    getValueFromMatrix(GameState, Row, FinalCol, 2).

/*
If failed, check for a path in the next row and final column
*/
checkHorizontalPath(GameState, Row, FinalCol):-
    Row =< FinalCol,
    NextRow is Row + 1,
    checkHorizontalPath(GameState, NextRow, FinalCol).
    
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
If there aren't any possible moves, returns an empty list
*/
valid_moves(GameState, Size, Player, ListOfMoves):-
    getPlayerInMatrix(GameState, Size, Player, Positions),
    getAllPossibleMoves(GameState, Size, Player, Positions, ListOfMoves).

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


%verifyPossibleMove(+GameState, +Size, +SelectedPosition, +Player, -ListOfMoves)
/*
Verifies if piece in the given position has any possible moves
*/
verifyPossibleMove(GameState, Size, SelectedRow-SelectedColumn, Player, ListOfMoves):-
    checkMove(GameState, Size, SelectedRow, SelectedColumn, Player, ListOfMoves),
    \+isEmpty(ListOfMoves).


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

%countElement(+Element, +List, -Count)
%Counts ocurrences of an element in a list
/*
Base case, empty list, Count of anything is 0. 
*/
countElement(_, [], 0).

/*
The Element in the head of the list is the same as what we want to count,
add 1 to the recursive Count.
*/
countElement(Element, [Element|T], Count):-
    countElement(Element, T, Count1),
    Count is Count1 + 1.

/*
The element in the head of the list is different, keep old Count
*/
countElement(Element, [H|T], Count):-
    Element \== H,
    countElement(Element, T, Count).


%sequenceOfNon0(+List, -Sequence)
/*
Returns in Sequence the length of the sequence of non 0 numbers in List
*/
sequenceOfNon0(List, Sequence):-
    delete(List, 0, SequenceList),
    length(SequenceList, Sequence).
    
/* --- BOT --- */

%choose_move(GameState, Size, Player, Level, Move)*/
/*
Selects a piece and a position to move (bot) if there are available moves for the player,
returning the move selected
Also prints the selected move
*/
choose_move(GameState, Size, Player, Level, Move):-
    valid_moves(GameState, Size, Player, ListOfPossibleMoves),
    movePiecePositionBot(GameState, Size, Player, Level, ListOfPossibleMoves, Move).

/*
If no available moves then select a piece to remove (bot), returning the move selected
Also prints the selected move
*/
choose_move(GameState, Size, Player, Level, Move):-
    getPlayerInMatrix(GameState, Size, Player, ListOfPositions),
    removePiecePositionBot(GameState, Size, Player, Level, ListOfPositions, Move).


%movePiecePositionBot(+GameState, +Size, +Player, +Level, +ListOfPossibleMoves, -SelectedMove)
/*
Select a random Move from the ListOfPossibleMoves, 
returning the move selected
*/
movePiecePositionBot(_, _, _, 'Easy', ListOfPossibleMoves, SelectedMove):-
    random_member(SelectedMove, ListOfPossibleMoves).

/*
Select the current best move (highest value)
returning the move selected
*/
movePiecePositionBot(GameState, Size, Player, 'Normal', ListOfPossibleMoves, [SelectedPosition, MovePosition]):-
    findall(
        Value-Move,
        (
            nth0(_, ListOfPossibleMoves, Move),
            move(GameState, Player, Move, NewGameState),
            value(NewGameState, Size, Player, Value)
        ),
        ValueMove
    ),
    sort(ValueMove, Sorted),
    last(Sorted, _-SelectedMove),
    getSelAndMovePosition(SelectedMove, SelectedPosition, MovePosition).


%removePiecePositionBot(+GameState, +Size, +Player, +Level, +ListOfPositions, -Move)
/*
Select a random position of the current player positions to remove the piece
returning the position selected
*/
removePiecePositionBot(_, _, _, 'Easy', ListOfPositions, SelPosition):-
    random_member(SelPosition, ListOfPositions).

/*
Select the current best player's piece to remove (highest value)
returning the move selected
*/
removePiecePositionBot(GameState, Size, Player, 'Normal', ListOfPositions, SelectedPosisiton):-
    findall(
        Value-Pos,
        (
            nth0(_, ListOfPositions, Pos),
            move(GameState, Player, Pos, NewGameState),
            value(NewGameState, Size, Player, Value)
        ),
        ValueMove
    ),
    sort(ValueMove, Sorted),    
    last(Sorted, _-SelectedPosisiton).


/*
Evaluate the board for the blue player
returning the current highest value
*/
value(GameState, Size, -1, Value):-
    getFFSpots(GameState, Size, ListOfFFSpots),
    getSpotsValues(GameState, Size, ListOfFFSpots, ListOfValues),
    max_member(Value, ListOfValues), !.

/*
Evaluate the board for the red player, transposing the matrix and using value/4 for the blue player 
Returns the current highest value
*/
value(GameState, Size, 1, Value):-
    transpose(GameState, Transposed),
    value(Transposed, Size, -1, Value).


%getFFSpots(+GameState, +Size, -ListOfFFSpots)
/*
Returna a list with all the independent Flood Fill spots positions of the board
*/
getFFSpots(GameState, Size, ListOfFFSpots):-
    getFFSpots(GameState, Size, 0, 0, ListOfFFSpots).

%getFFSpots(+GameState, +Size, +Row, +Column, -ListOfFFSpots)
/*
Base case, when the position is Row=8 Column=0, it stops (end of the board)
*/
getFFSpots(_, Size, Row, Column, []):-
    checkEndPosition(Row, Column, Size).
/*
Tries to Flood Fill current position and calls itself recursively in the next position
*/
getFFSpots(GameState, Size, Row, Column, ListOfFFSpots):-
    tryFloodFill(GameState, Size, Row, Column, UpdatedGameState),
    nextPosition(Row, Column, Size, NextRow, NextColumn),
    getFFSpots(UpdatedGameState, Size, NextRow, NextColumn, TempFFSpots),
    append(TempFFSpots, [Row-Column], ListOfFFSpots).

/*
If Flood Fill failed try again in the next position
*/
getFFSpots(GameState, Size, Row, Column, ListOfFFSpots):-
    nextPosition(Row, Column, Size, NextRow, NextColumn),
    getFFSpots(GameState, Size, NextRow, NextColumn, ListOfFFSpots).


%getSpotsValues(+GameState, +Size, +ListOfFFSpots, -ListOfValues)
/*
Base case, when the ListOfFFSpots is empty ListOfValues is empty as well
*/
getSpotsValues(_, _, [], []).

/*
Flood Fills the spot in the head of ListOfFFSpots list and gets its value
Calls itself recursively with the tail of the list
*/
getSpotsValues(GameState, Size, [Row-Column|RestFFSpots], ListOfValues):-
    floodFill(GameState, Size, Row, Column, 0, 2, UpdatedGameState),
    getValuesInAllRows(UpdatedGameState, Size, ListOfRowsValues),
    sequenceOfNon0(ListOfRowsValues, SequenceValue),
    getSpotsValues(GameState, Size, RestFFSpots, TempValues),
    append(TempValues, [SequenceValue], ListOfValues).
    

%getValuesInAllRows(+GameState, +Size, -ListResult)
/*
Returns a list with the numbers of Flood Fill characters for each row
*/
getValuesInAllRows(GameState, Size, ListOfRowsValues):-
    getValuesInAllRows(GameState, Size, 0, ListOfRowsValues).

%getValuesInAllRows(+GameState, +Size, +RowIndex, -ListResult)
/*
Base case, RowIndex is equal to board size which means every row was counted
*/
getValuesInAllRows(_, Size, Size, []).

/*
Counts the number of Flood Fill characters in the current row (head of the list)
Call itself recursively to get the other rows counts
*/
getValuesInAllRows([Row|RestRows], Size, RowIndex, ListOfRowsValues):-
    countElement(2, Row, Amount),
    NextRowIndex is RowIndex+1,
    getValuesInAllRows(RestRows, Size, NextRowIndex, TempRowsValues),
    append(TempRowsValues, [Amount], ListOfRowsValues).