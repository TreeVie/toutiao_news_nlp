import React from "react"

interface FeedProps {
    // 显示feature的最大数量
    MAXFEATURECOUNT?: number
    data: FeedDataProps
}

export interface FeedDataProps {
    src: string
    alt: string
    features: string[]
}

export default class Feed extends React.Component<FeedProps> {
    static defaultProps = {
        MAXFEATURECOUNT: 3,
        data: {}
    }

    render() {
        const { data: { src, alt, features }, MAXFEATURECOUNT } = this.props
        return (
            <div className="Feed">
                <div className="FeedSource">
                    <div className="FeedSource-fristline">
                        <p>
                            来源:<span>今日头条</span>
                        </p>
                    </div>
                    <div className="ContentItem">
                        <img src={src} alt={alt} />
                        <h2 className="ContentItem-title">
                            美国和中国打过贸易战吗？
                        </h2>
                        <div className="AnswerItem-extraInfo" />
                        <div className="">
                            1990年我去了一趟莫斯科，也就是前苏联解体前的一年多。巨大的超市货架上空空如也。只有两个商品：塑料袋和番茄汁（无添加肉或洋葱的）。每样商品的间距好大啊，有50厘米。在火车上认识的两个中国人，其中一个人提出去超市转一圈，顺便买个饮料，当时国内的超市也不怎么样，想想应该见识一下莫斯科的超市。结果我们三人到了超市，他实在没办法，就买了一瓶番茄汁喝了，我也尝了一口，基本可以当饮料。
                            作者：匿名用户
                            链接：https://www.zhihu.com/question/271396589/answer/361689296
                            来源：知乎
                            著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
                        </div>
                    </div>
                    <div className="FeedSource-lastline">
                        <Feature features={features} count={MAXFEATURECOUNT} />
                    </div>
                </div>
            </div>
        )
    }
}

function Feature({ features, count }) {
    return (
        <div className="features">
            {features &&
                features.reduce((pref, f, i) => {
                    let _f = (
                        <span key={i} className="feature">
                            {f}
                        </span>
                    )
                    i < count && pref.push(_f)
                    return pref
                }, [])}
        </div>
    )
}
