module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'components': '@/components',
                'views': '@/views',
                'network': '@/network',
                'common': '@/common'
            }
        }
    },
    publicPath: './',
    devServer: {
        open: true,
        port: 8080
    }
}