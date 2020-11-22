import React from "react";
import {Header, Form, Rating, Segment, Menu} from "semantic-ui-react";
import axios from "axios"; // API 연동
import CommentItem from "./CommentItem";

class UserComment extends React.Component {
    state = {
        movie_id: '',
        score: 0,
        description: ''
    }

    handleRate = (e, rating) => {
        this.setState({
            score: parseInt(rating.rating)
        })
    }

    handleChange = (e, {name, value}) => this.setState({[name]: value})

    handleSubmit = () => {
        this._submitComment();
    }

    _submitComment() {
        const CommentData = {
            movie_id: this.props.movie_id,
            score: this.state.score,
            body: this.state.description
        }
        return (
            axios.post("/data/users/edit_comment", CommentData)
                .then((response) => {
                    if (response.data.result === true)
                        window.location.reload()
                }).catch(() => {
                alert('작성에 실패하셨습니다 !');
            })
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            commentList: [],
            userCommentList: [],
            cpage_id: 1
        };
    }

    handleItemDown = (e) => {
        if (this.state.cpage_id === 1) {
            this.setState({
                cpage_id: 1
            })
        } else {
            this.setState({
                cpage_id: this.state.cpage_id - 1
            })
        }
        this.componentDidMount();
    }

    handleItemUp = () => {
        this.setState({
            cpage_id: this.state.cpage_id + 1
        })
        this.componentDidMount();
    }

    componentDidMount() {
        this._getCommentList();
    }

    _getCommentList() {
        axios.get("/data/comments/" + this.props.movie_id + "?page=" + this.state.cpage_id)
            .then(data => {
                this.setState({
                    commentList: data.data.results
                });
            })
            .catch(error => {
                console.log(error)
            });
    }

    // _getUserCommentList() {
    //     axios.get("/data/users/" + this.props.user)
    // }
    render() {
        const {description} = this.state;

        const comments = [];

        // eslint-disable-next-line array-callback-return
        this.state.commentList.map(comment => {
            comments.push(<CommentItem score={comment.score} body={comment.body}/>);
        })


        const user_comments = [];

        // eslint-disable-next-line array-callback-return
        this.state.commentList.map(comment => {
            comments.push(<CommentItem score={comment.score} body={comment.body}/>);
        })


        return (
            <div>
                <br/>
                <Segment raised>
                    <Header as='h2' dividing>
                        익명 한줄 평
                    </Header>
                    <Segment>
                        <Segment.Group vertical>
                            {comments}
                        </Segment.Group>
                    </Segment>
                    <Menu widths={2}>
                        <Menu.Item onClick={this.handleItemDown}>Down</Menu.Item>
                        <Menu.Item onClick={this.handleItemUp}>Up</Menu.Item>
                    </Menu>
                </Segment>
                <br/>

                <Segment raised>
                    <Header as='h2' dividing>
                        유저 한줄 평
                    </Header>
                    <Segment>
                        <Segment.Group vertical>
                            {user_comments}
                        </Segment.Group>
                    </Segment>
                    <Menu widths={2}>
                        <Menu.Item onClick={this.handleItemDown}>Down</Menu.Item>
                        <Menu.Item onClick={this.handleItemUp}>Up</Menu.Item>
                    </Menu>
                </Segment>
                <br/>

                <div>
                    <Segment raised>
                        <Header as='h2' dividing>
                            평가하기
                        </Header>
                        <Segment>
                            <Segment.Group horizontal>
                                <Segment>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Segment>
                                            평점 : <Rating icon='star' maxRating={10} onRate={this.handleRate} clearable/>
                                        </Segment>
                                        <Form.TextArea
                                            name='description'
                                            value={description}
                                            onChange={this.handleChange}
                                        />
                                        <Form.Button secondary>평가하기</Form.Button>
                                    </Form>
                                </Segment>
                            </Segment.Group>

                        </Segment>
                    </Segment>
                </div>
                <br/>
            </div>
        )
    }
}

export default UserComment;