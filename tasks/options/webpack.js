var webpack = require('webpack');

module.exports = function(grunt) {
    var config = require('../../webpack.config.js')(grunt);

    config.progress = !grunt.option('webpack-no-progress');
    config.devtool = grunt.option('webpack-devtool') || 'cheap-source-map';

    return {
        options: config,
        build: {
            mode: 'production',
        },
    };
};
