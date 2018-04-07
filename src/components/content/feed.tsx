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
                <img src={src} alt={alt} />
                <Feature features={features} count={MAXFEATURECOUNT}/>
            </div>
        )
    }
}

function Feature({features,count}) {
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
