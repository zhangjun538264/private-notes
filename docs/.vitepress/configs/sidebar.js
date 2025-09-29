export const sidebar = {
    '/views/base/': [
        {
            text: 'JavaScript 基础知识',
            collapsed: false,
            items: [
                { text: '数据类型', link: '/views/base/javascript/types' },
                { text: '引用类型的拷贝', link: '/views/base/javascript/clone' },
                { text: '类型转换', link: '/views/base/javascript/conversions' },
                { text: '原型和原型链', link: '/views/base/javascript/prototype' },
                { text: '继承', link: '/views/base/javascript/inherit' }
            ]
        },
        {
            text: 'ES6 常用知识点',
            link: '/views/base/es6/'
        },
        {
            text: 'TypeScript',
            collapsed: false,
            items: [
                { text: '基础知识', link: '/views/base/typescript/base' },
                { text: '编译配置', link: '/views/base/typescript/tsconfig' },
                { text: '类型体操', link: '/views/base/typescript/challenges' }
            ],
            link: '/fe/typescript/base'
        },
        {
            text: 'HTML / CSS',
            collapsed: false,
            items: [
                { text: 'HTML 理论知识点', link: '/fe/html/' },
                { text: 'CSS 理论知识点', link: '/fe/css/' }
            ]
        },
        {
            text: '前端工程化',
            collapsed: false,
            items: [
                { text: 'Vite', link: '/views/base/build/vite' },
                { text: 'Webpack', link: '/fe/webpack/' },
            ]
        },
        {
            text: '浏览器与网络',
            collapsed: false,
            items: [
                { text: '浏览器相关知识点', link: '/fe/browser/' },
                { text: 'TCP', link: '/fe/network/tcp' },
                { text: 'HTTP', link: '/fe/network/http' }
            ]
        },
        {
            text: 'Node',
            collapsed: false,
            items: [{ text: 'package.json', link: '/views/base/node/pkg' }]
        },
        {
            text: '概念知识点',
            collapsed: false,
            items: [
                { text: '模块化', link: '/fe/concept/module' },
                { text: '前端页面渲染方式', link: '/fe/concept/page-rendering' }
            ]
        },
        {
            text: '编程题',
            link: '/fe/coding/'
        },
        {
            text: '面试宝典',
            collapsed: true,
            items: [
                { text: '计算机基础', link: '/views/base/interview/computerBase' },
                { text: 'HTML 和 CSS', link: '/views/base/interview/html-css' },
                { text: 'JavaScript', link: '/views/base/interview/javascript' },
                { text: 'TypeScript', link: '/views/base/interview/typescript' },
                { text: 'HTTP', link: '/views/base/interview/http' },
                { text: 'ES6', link: '/fe/concept/page-rendering' },
                { text: 'Vue2', link: '/fe/concept/module' },
                { text: 'Vue3', link: '/fe/concept/page-rendering' },
                { text: 'React', link: '/fe/concept/module' },
                { text: 'Node', link: '/fe/concept/page-rendering' },
                { text: 'Webpack', link: '/fe/concept/page-rendering' },
                { text: 'Git', link: '/fe/concept/module' },
                { text: '小程序', link: '/fe/concept/page-rendering' },
            ]
        }
    ],
    '/views/core/': [
        {
            text: 'Vue 相关',
            items: [
                { text: 'Vue3.4源码解析', link: '/views/core/vue/3.4' },
                { text: 'React 常见面试题', link: '/analysis/react/interview' }
            ]
        },
        {
            text: '工具库',
            // collapsed: false,
            items: [
                { text: 'only-allow', link: '/analysis/utils/only-allow' },
                { text: 'clsx', link: '/analysis/utils/clsx' },
                { text: 'await-to-js', link: '/analysis/utils/await-to-js' }
            ]
        }
    ],
    '/views/workflow/': [
        {
            text: '编程规范',
            link: '/workflow/style-guide'
        },
        {
            text: '常用工具/方法',
            collapsed: false,
            items: [
                { text: '工具库整理', link: '/workflow/utils/library' },
                { text: '常用正则整理', link: '/workflow/utils/regexp' },
                { text: '常用代码片段', link: '/workflow/utils/snippets' }
            ]
        },
        {
            text: '常用库的使用与配置',
            collapsed: false,
            items: [
                { text: 'Tailwind CSS', link: '/workflow/library/tailwindcss' },
                { text: 'Day.js', link: '/workflow/library/dayjs' }
            ]
        },
        {
            text: 'HTML / CSS 相关',
            collapsed: false,
            items: [
                { text: 'HTML 奇淫技巧', link: '/workflow/html/tricks' },
                { text: 'CSS 语法', link: '/workflow/css/spec' },
                { text: 'CSS 奇淫技巧', link: '/workflow/css/tricks' },
                { text: 'Sass 常用技巧', link: '/workflow/sass/' }
            ]
        },
        {
            text: 'Vue 相关',
            link: '/workflow/vue/'
        },
        {
            text: 'Node 相关',
            // collapsed: false,
            items: [{ text: 'npm 常用命令', link: '/workflow/node/npm' }]
        },
        {
            text: '终端相关',
            collapsed: false,
            items: [
                { text: 'Zsh 配置', link: '/workflow/terminal/zsh' },
                { text: '命令行工具', link: '/workflow/terminal/toolkit' },
                { text: 'Shell 命令', link: '/workflow/terminal/shell' }
            ]
        },
        {
            text: 'Git 相关',
            collapsed: false,
            items: [
                { text: 'Git 命令清单', link: '/views/workflow/git' },
                { text: 'Git 使用心得', link: '/views/workflow/git/command' }
            ]
        }
    ],
    '/efficiency/': [
        {
            text: '软件推荐与配置',
            // collapsed: false,
            items: [
                { text: '多平台软件', link: '/efficiency/software/cross-platform' },
                { text: 'Mac 平台', link: '/efficiency/software/mac' },
                { text: 'Windows 平台', link: '/efficiency/software/windows' },
                { text: '浏览器设置与扩展', link: '/efficiency/software/browser' },
                { text: 'Visual Studio Code 配置', link: '/efficiency/software/vscode' },
                { text: 'WebStorm 配置', link: '/efficiency/software/webstorm' }
            ]
        },
        { text: '在线工具', link: '/efficiency/online-tools' },
        { text: '书签脚本', link: '/efficiency/bookmark-scripts' }
    ],
    '/pit/': [
        {
            text: '踩坑记录',
            // collapsed: false,
            items: [
                { text: 'npm 踩坑记录', link: '/pit/npm' },
                { text: '第三方库踩坑记录', link: '/pit/library' },
                { text: 'PC 踩坑记录', link: '/pit/pc' },
                { text: 'H5 踩坑记录', link: '/pit/h5' },
                { text: '微信开发踩坑记录', link: '/pit/wechat' }
            ]
        }
    ],
}
