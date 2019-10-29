import React from 'react';
import BoardModel from "../../data-models/BoardModel";
import {MDBContainer, MDBRow, MDBCol} from "mdbreact";

interface Props {
    boards: BoardModel[]
}

interface State {
}

export default class Boards extends React.Component<Props, State> {

    lastSeenBoards = () => {
        let lastBoards: any[];
        lastBoards = [];
        this.props.boards.filter(board => board.seenInLastTime)
            .filter((board, index) => (index < 6))
            .every(board =>
            lastBoards.push(
                <MDBCol key={board.id} md="2" onClick={() => this.openBoard(board.id)}>
                    {board.name}
                    <img src={board.backgroundUrl} className="img-thumbnail" alt=""/>
                </MDBCol>)
        );
        return <MDBContainer className="mt-3">
            <MDBRow className="mb-1">
                <h3><i className="far fa-clock"></i> Ostatnio oglądane</h3>
            </MDBRow>
            <MDBRow className="mb-2">
                {lastBoards}
            </MDBRow>
        </MDBContainer>;
    }
    privateBoards = () => {
        let privateBoards: any[];
        privateBoards = [];
        this.props.boards.filter(board => board.isPrivate)
            .filter((board, index) => (index < 5))
            .every(board =>
                privateBoards.push(
                    <MDBCol key={board.id} md="2" onClick={() => this.openBoard(board.id)}>
                        {board.name}
                        <img src={board.backgroundUrl} className="img-thumbnail" alt=""/>
                    </MDBCol>)
            );
        return <MDBContainer className="mt-5">
            <MDBRow className="mb-1">
                <h3><i className="far fa-user"></i> Prywatne</h3>
            </MDBRow>
            <MDBRow className="mb-2">
                {privateBoards}
            </MDBRow>
        </MDBContainer>;
    }

    render() {
        return [
            this.lastSeenBoards(),
            this.privateBoards(),

        ]

    }

    private openBoard(id: number) {
        //TODO open board of id given as parameter when board component is created
    }
}
