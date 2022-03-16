import React, {Component} from 'react';
import { IconContext } from "react-icons";
import { AiFillCaretDown } from "react-icons/ai";
import { AiFillCaretUp } from "react-icons/ai";
import './filterDropDown.css'

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerTitle: this.props.title,
            isListOpen: false,
        };
    }

    toggleList = () => {
        this.setState(prevState => ({
            isListOpen: !prevState.isListOpen
        }))
    }

    selectItem = (item) => {
        this.setState({
            headerTitle: item.title,
            isListOpen: false
        });
        this.props.setHomeTypeProperties(item);
    }

    render() {
        return (
            <div className="dd-wrapper">
                <button
                    type="button"
                    className="dd-header"
                    onClick={this.toggleList}
                >
                    <div className="dd-header-title">
                        <span className='dd-header-title-text'>{this.state.headerTitle}</span>
                        {this.state.isListOpen
                        ? <IconContext.Provider value={{className: "caret-icon"}}>
                            <AiFillCaretUp />
                        </IconContext.Provider>
                        : <IconContext.Provider value={{className: "caret-icon"}}>
                            <AiFillCaretDown />
                        </IconContext.Provider>}</div>
                </button>
                {this.state.isListOpen && (
                    <div
                        role="list"
                        className="dd-list"
                    >
                        {this.props.list.map((item) => (
                            <button
                                type="button"
                                className="dd-list-item"
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.selectItem(item)
                                }}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
    }
}

export default Dropdown;