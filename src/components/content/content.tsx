/**
 * 显示新闻列表
 * 1. 新闻图片
 * 2. 新闻简介
 * 3. 关键词标注、作者、时间、出处等信息
 * 4. 工具栏 包含 点赞、评论、舆情分析
 */
import React, { Component } from "react"

import Feed, { FeedDataProps as DataProps } from "./feed"

let data = require("../../mock/data");

interface ContentProps {
    // dataSource:DataProps[]
}

interface ContentState {
    dataSource: DataProps[]|any
}
interface Words {
    // 中文词性标注
    wtype_cn: string
    // 词性标注
    wtype: string
    // 分词结果
    word: string
}
interface Message {
    // 新闻标签
    label: string
    // 新闻的大标题
    title: string
    // 摘要
    abstract: string
    // 摘要的分词处理
    cut_list: Words[]
    // 源地址
    source_url: string
    tag: string
}
interface ResultProps {
    data: Message[]
    time: string
}
export default class Content extends Component<ContentProps, ContentState> {
    state = {
        dataSource: []
    }

    getData(page = 1) {
        // fetch(`http://106.14.201.218:8000/get_toutiao_data?page=${page}`)
        //     .then((response: Response) => {
        //         return response.json()
        //     })
        //     .then((res: ResultProps) => {
        //         res.data
        //     })
        return Promise.resolve(()=>{
            return [
                {
                    src:
                        "http://www.cr173.com/up/2016-4/14616501097482450.jpg",
                    alt: "图片加载中...",
                    features: ["二次元"]
                },
                {
                    src:
                        "http://www.cr173.com/up/2016-4/14616501097482450.jpg",
                    alt: "图片加载中...",
                    features: ["二次元"]
                },
                {
                    src:
                        "http://www.cr173.com/up/2016-4/14616501097482450.jpg",
                    alt: "图片加载中...",
                    features: ["二次元"]
                },
                {
                    src:
                        "http://www.cr173.com/up/2016-4/14616501097482450.jpg",
                    alt: "图片加载中...",
                    features: ["二次元"]
                },
                {
                    src:
                        "http://www.cr173.com/up/2016-4/14616501097482450.jpg",
                    alt: "图片加载中...",
                    features: ["二次元"]
                }
            ]
        })
    }

    componentDidMount() {
        // 请求数据
        this.getData().then(res=>{
            this.setState({dataSource:res})
        })
    }

    render() {
        const { dataSource } = this.state
        return (
            <div className="TopstoryMain">
                {dataSource.map((data, index) => {
                    return <Item key={index} data={data} />
                })}
            </div>
        )
    }
}

interface ItemProps {
    data: DataProps
}

/**
 * Sider部分的新闻展示item
 * 图片 + 关键词标注
 */
class Item extends Component<ItemProps> {
    static defaultProps = {
        data: null
    }
    render() {
        const { data } = this.props
        return (
            <div className="Card TopstoryItem">
                <ButtonClose />
                {data && <Feed data={data} />}
            </div>
        )
    }
}

function ButtonClose() {
    return (
        <button className="Button Close">
            <svg
                viewBox="0 0 14 14"
                className="Icon Icon--remove"
                style={{ width: 10, height: 10 }}
                aria-hidden="true"
                data-reactid="85"
            >
                <g>
                    <path d="M8.486 7l5.208-5.207c.408-.408.405-1.072-.006-1.483-.413-.413-1.074-.413-1.482-.005L7 5.515 1.793.304C1.385-.103.72-.1.31.31-.103.724-.103 1.385.305 1.793L5.515 7l-5.21 5.207c-.407.408-.404 1.072.007 1.483.413.413 1.074.413 1.482.005L7 8.485l5.207 5.21c.408.407 1.072.404 1.483-.007.413-.413.413-1.074.005-1.482L8.485 7z" />
                </g>
            </svg>
        </button>
    )
}
