var NProgress = require("nprogress");

interface RequestData {
  // post数据
  post(): Promise<any>;
  // 获取文件
  getFiles(): void;
}

interface ResponseData {
  error?: object;
  [name: string]: any;
}

interface Params {
  file?: File;
  filename?: string;
}

type validateData={
  res:Response,
  text:string
}

export class Req {
  protected url: string;
  protected params: Params = {};
  // protected contentType : string = 'application/x-www-form-urlencoded';
  protected callback?: Function;
  protected queue = [];
  public activeQueue = this.queue;
  protected complete?: Function;
  // 返回数据的外部键值
  protected dataKey?: string;
  // 返回数据的类型 text或者json
  protected type: string = "json";
  protected errorMessage = `cannot fetch ${this.url}`;
  protected promise;
  protected responseData;
  public response

  constructor(url: string, params?: object) {
    this.url = url;
    this.params = params || this.params;
    // return this;
  }

  protected init(): RequestInit {
    this.params["isAjax"] = true;
    return {
      method: "POST",
      // 此配置可以让请求带上cookie
      credentials: "include",
      body: this.transParams(this.params),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
  }
  /**
   * 将json对象转换为 form表单数据
   * @param params 请求参数
   */
  protected transParams(params?: object): string {
    params = params || this.params;
    return encodeURI(
      Object.keys(params)
        .reduce(
          (pre, key) => pre + "&" + String(key) + "=" + String(params[key]),
          ""
        )
        .slice(1)
    );
  }
  /**
   * 因为后台返回数据很多都以 dataKey 为键值
   */
  post(
    // dataKey: string = this.dataKey || "dataList",
    dataKey,
    type?: "text" | "json"
  ): Req {
    this.dataKey = dataKey || this.dataKey;
    type && (this.type = type);
    return this.wrapperFetch(fetch(this.url, this.init()));
  }

  //GET请求
  get(dataKey) {
    let url = this.url + "?" + this.transParams();
    return this.wrapperFetch(fetch(url, { credentials: "include" }));
  }

  // 通过表单请求获取文件
  getFiles() {
    NProgress.start();
    var formdata = new FormData();
    var form = document.createElement("form");
    var params = this.params;

    form.setAttribute("action", this.url);
    form.setAttribute("style", "display:none;");

    for (let key in params) {
      let input = document.createElement("input");
      input.setAttribute("name", key);
      input.setAttribute("value", params[key]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    form.remove();
  }
  // 上传文件
  sendFiles() {
    var _this = this;

    var xhr = new XMLHttpRequest();

    var formdata = new FormData();

    Object.keys(this.params).map(key => {
      formdata.append(key, this.params[key]);
    });
    // 文件名与文件对应起来
    formdata.append(this.params.filename, this.params.file);

    xhr.onerror = info.showStack.bind(new Error("Cannot upload this file"));

    xhr.onload = function() {
      if (xhr.status < 200 || xhr.status > 300) {
        return info.showStack(
          new Error(`Cannot upload this file.Status is ${xhr.status}.`)
        );
      }
      info.success();
      try {
        _this.handleCallback(JSON.parse(xhr.responseText));
      } catch (e) {
        console.error(e);
      }
    };

    xhr.open("post", this.url, true);
    // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
    // 携带cookie
    "withCredentials" in xhr && (xhr.withCredentials = true);

    // when set headers['X-Requested-With'] = null , can close default XHR header
    // see https://github.com/react-component/upload/issues/33
    //   if (headers['X-Requested-With'] !== null) {
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //   }
    xhr.send(formdata);

    return this;
  }

  /**
   * 获取表格数据 因为之前项目使用了jqgrid 所以此处要配置相应的参数
   * @param key 返回数据的键值 便于直接取到需要的值
   */
  getGridData(key: string = "page"): Req {
    const gridinfo = {
      _search: false,
      nd: new Date().getTime(),
      "page.pageInfo.rowsOfPage": 10000,
      "page.pageInfo.currentPageNum": 1,
      "order.sortCol": "",
      "order.sortOrder": "desc",
      isGridRequest: true
    };
    this.params = Object.assign({}, gridinfo, this.params);
    return this.wrapperFetch(fetch(this.url, this.init()));
  }

  protected wrapperFetch(action: Promise<any>): Req {
    NProgress.start();
    this.promise = action
      .then(this.validateResponse.bind(this))
      .then(this.isEmpty.bind(this))
      .then(this.handleResponse.bind(this))
      .then(() => {
        NProgress.done();
      })
      .catch((error: Error) => {
        NProgress.done();
        if (error.message.indexOf("Unexpected token < in JSON") !== -1) {
          sessionStorage.clear();
          browserHistory.replace(UrlPrefix);
          return;
        }
        let modal = info.showStack(error);
        setTimeout(() => {
          if (modal) {
            modal.destroy();
          }
        }, 20 * 1000);
      });
    return this;
  }

  // 验证返回数据
  validateResponse(res: Response): string | object {
    NProgress.inc();
    this.complete && this.complete();
    // session过期或者是登录信息被清空
    if (res.headers.has("Set-Cookie")) {
      sessionStorage.clear();
      browserHistory.replace(UrlPrefix);
    }
    let copy = res.clone();
    this.response = res;
    // return {res,text:copy.text()}
    return copy.text()
  }
  
  isEmpty(t:string){
    if (!t) {
      return {
        msgCode: {
          type: "error",
          msg: getText('nodata')
        }
      };
    }
    if (this.type === "text") {
      return this.response.text();
    }
    var r: any = this.response.json();
    return r;
  }

  // 数据验证统一处理之后返回this 然后统一通过then返回promise对象 then用于处理回调
  then(callback: Function): Req {
    this.activeQueue.push(callback);
    return this;
  }

  // 请求完成就会调用的函数
  finally(complete) {
    this.complete = complete;
    return this.promise;
  }

  // 处理回调函数
  handleCallback(result) {
    return this.emit(this.queue, result, true, this.params);
  }

  // 统一处理后台数据
  handleResponse(data: any) {
    NProgress.inc();
    // 统一后台提示信息的展示
    if (data.msgCode) {
      if (data.msgCode.type != "SUCCESS") {
        info.error(data.msgCode.msg);
      } else {
        info.success(data.msgCode.msg);
      }
    }
    // 缓存返回数据
    this.responseData = data;
    if (!this.dataKey) {
      return this.handleCallback(data);
    }
    try {
      if (data instanceof Array) {
        data.map((row, index) => {
          row["key"] || (row["key"] = index);
        });
      } else if (this.dataKey) {
        data = Object.keys(data).length === 1 ? data[this.dataKey] : data;
        typeof data === "string" && (data = JSON.parse(data));
        if (data instanceof Array) {
          data.map((row, index) => {
            row instanceof Object && (row["key"] || (row["key"] = index));
          });
        }
      }
    } catch (e) {
      console.error(e.message || "数据解析异常，请查看此请求");
    }
    return this.handleCallback(data);
  }
  /**
   * 事件队列处理
   * @param queue         待处理事件队列
   * @param initialValue  初始值
   * @param params        处理事件过程中需要传递的参数
   * @param empty         事件队列处理完之后是否需要清空
   */
  emit(queue, initialValue, empty = true, params?) {
    queue.reduce(function(pre, cur) {
      NProgress.inc(0.2);
      return cur(pre, params);
    }, initialValue);
    // 删除时候不能直接 queue = [];
    empty && (queue.length = 0);
  }
}

class Monitor extends Req {
  // 默认时间间隔是15分钟
  private timeSpan: number = 15 * 60 * 10000;
  // 实例处于watch状态时候 不能使用该实例继续watch
  private watching = false;
  private brush;
  // 初始化需重复执行的事件队列
  private repeat = [];

  public set(options) {
    Object.assign(this, options);
    return this;
  }
  // 设置需要重复调用的回调
  public watch(callback): Req {
    this.repeat.push(callback);
    return this;
  }

  /**
   * 处理回调函数
   * @param result 上一步回调返回的结果 一般是fetch经过handleresponse处理过的数据
   * @param queue  回调队列
   * tips 回调队列执行完之后只会清理实例中queue中的回调函数，针对需要持久化的回调，例如Monitor中的this.repeat回调队列，不做处理
   */
  public handleCallback(result, queue?) {
    // 执行repeat业务
    let res = this.emit(this.repeat, result, false, this.params);
    // 执行回调监测  及通过_then方法添加到this.queue中的回调 此回调用于设置定时器
    this.emit(this.queue, result);
  }

  public monitor(dataKey?: string) {
    this.dataKey = dataKey || this.dataKey || "dataList";
    this.watching = true;
    if (this.timeSpan < 1000) {
      console.warn(`the timeSpan is too short`);
    }
    var timeStamp = +new Date();
    // if(window.timeStaps){
    //   console.log(timeStamp-window.timeStaps)
    // }
    // window.timeStaps = timeStamp;
    // 因为该函数在 this.emit中执行 执行之后 this.queue置空 所以需要异步push回调
    setTimeout(() => {
      this.queue.push(res => {
        let t = +new Date();
        // 请求的时间间隔
        let span = t - timeStamp;
        if (span >= this.timeSpan) {
          this.monitor();
        } else {
          let delay = this.timeSpan - span;
          this.brush = setTimeout(() => {
            this.monitor();
          }, delay);
        }
        return res;
      });
    }, 0);
    this.activeQueue = this.repeat;
    return this.post();
  }
}

const req = function(url: string, params?: object) {
  let request = new Monitor(url, params);
  // request.monitor = new Monitor(url, params);
  return request;
};
export default req;
module.exports = exports["default"];
