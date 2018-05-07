import React, { KeyboardEvent } from "react"
import {Message} from "./content"
import Modal from "../widgets/modal"

interface FeedProps {
    // 显示feature的最大数量
    MAXFEATURECOUNT?: number
    data: Message
}

export interface FeedDataProps {
    
}

export default class Feed extends React.Component<FeedProps,any> {
    static defaultProps = {
        MAXFEATURECOUNT: 3
    }

    constructor(props:FeedProps){
        super(props);
        this.state = {
            showModal:false
        }
        this.onFeedClick = this.onFeedClick.bind(this);
    }

    onFeedClick(event:React.MouseEvent<HTMLDivElement>){
        // 可以跳转的a标签
        if((event.target as HTMLDivElement).className.includes("a_enable")){
            return;
        }
        this.setState({showModal:true})
    }

    render() {
        const { data, MAXFEATURECOUNT } = this.props
        return (
            <div className="Feed" onClick={this.onFeedClick}>
                <div className="FeedSource">
                    <div className="FeedSource-fristline">
                        <p>
                            来源:<span>{data.label}</span>
                        </p>
                    </div>
                    <div className="ContentItem">
                        <img style={{height:Math.max(100,240*(Math.random()))}} src={"http://www.cr173.com/up/2016-4/14616501097482450.jpg"} />
                        <h2 className="ContentItem-title">
                            <a className="a_enable" href={data.source_url} target="blank">{data.title||"美国和中国打过贸易战吗？"}</a>
                        </h2>
                        <div className="AnswerItem-extraInfo" />
                        <article className="">
                            {data.abstract}
                        </article>
                    </div>
                    <div className="FeedSource-lastline">
                        <Feature features={data.cut_list} count={MAXFEATURECOUNT} />
                    </div>
                </div>
                {this.state.showModal&&<Modal title={"Hello"}></Modal>}
            </div>
        )
    }
}

function Feature({ features, count }) {
    return (
        <div className="features">
            {features && ((features.length = Math.min(features.length,count)),1) &&
                features.map((feature, i) => {
                    return (
                        <span key={i} className="feature">
                            {feature.word}
                        </span>
                    )
                })}
        </div>
    )
}
