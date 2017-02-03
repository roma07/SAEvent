module.exports = {
    entry: {
        event: './src/scripts/entry.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'scripts/[name].bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint',
                exclude: /(node_modules|bower_components)/
            }
        ],
        loaders: [
            {
                test: /\.sass$/,
                loader: 'style!css!sass'
            }, {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};