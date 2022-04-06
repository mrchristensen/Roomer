import React, {Component} from 'react';
import './filter.css'
import { AiOutlineSearch } from "react-icons/ai";
import { IconContext } from 'react-icons';

class FilterTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [
                "Gym",
                "South Campus",
                "Mixed Housing",
                "Social",
                "In Unit Laundry",
                "Parking Spot"
            ],
            selectedTags: props.selectedTags ? props.selectedTags : []
        }
    }

    updateSelectedTags = (tag, isSelected) => {
        if (isSelected) {
            this.state.selectedTags.push(tag);
            this.setState({
                selectedTags: this.state.selectedTags
            });
            this.props.confirmSelectedTags(this.state.selectedTags);
        } else {
            let index = this.state.selectedTags.indexOf(tag);
            console.log(index);
            this.state.selectedTags.splice(index, 1);
            console.log(this.state.selectedTags);
            this.setState({
                selectedTags: this.state.selectedTags
            })
            this.props.confirmSelectedTags(this.state.selectedTags);
        }
    }

    capitalize = (val) => {
        let words = val.split(" ");

        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }

        return words.join(" ");
    }

    inputKeyDown(e) {
        const val = e.target.value;
        if (e.key === 'Enter' && val) {
            if (this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
                return;
            }
            this.setState({ tags: [...this.state.tags, val]});
            this.updateSelectedTags(val, true);
            this.tagInput.value = null;
        } else if (e.key === 'Backspace' && !val) {
            this.removeTag(this.state.tags.length - 1);
        }
    }

    render() {
        return (
            <div className='tags-container'>
                <h2 className='filter-body-header'>Tags</h2>
                <div className='tags-body'>
                    <div className='tags-input tags-input__index'>
                        <input type='text' placeholder='Enter a tag' onKeyDown={(e) => this.inputKeyDown(e)} 
                        ref={c => { this.tagInput = c; }} />
                        <div type='submit' className='location-button'>
                            <IconContext.Provider value={{className: "search-icon-tags"}}>
                                <AiOutlineSearch />
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className='tags-list'>
                        <ul className='tags-list__tags'>
                            { this.state.tags.map((tag, i) => (
                                <Tag tag={tag} updateSelectedTags={this.updateSelectedTags} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

class Tag extends Component {
    constructor(props) {
        super(props);
        if (props.tag) {
            this.state = {
                isSelected: false
            }
        } else {
            this.state = {
                isSelected: true
            }
        }
    }

    removeTag = (tag) => {
        if (this.state.isSelected) {
            this.setState({
                isSelected: false
            })
        } else {
            this.setState({
                isSelected: true
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isSelected != this.state.isSelected) {
            console.log("Here")
            this.props.updateSelectedTags(this.props.tag, this.state.isSelected);
        }
    }

    render() {
        return (
            this.state.isSelected ? (
                <li key={this.props.tag}  onClick={() => { this.removeTag(); }}>
                    {this.props.tag}
                    <button type="button">x</button>
                </li>
            ) : (
                <li key={this.props.tag} onClick={() => { this.removeTag(this.props.tag); }} className='tag__not-selected'>
                    {this.props.tag}
                </li>
            )
        )
    }
}

export default FilterTags 