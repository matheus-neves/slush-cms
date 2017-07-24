const
  PROD       = (process.env.NODE_ENV == 'prod' ? true : false); 
  nib        = require('nib'),
  jeet       = require('jeet'),
  rupture    = require('rupture'),
  kswiss     = require('kouto-swiss'),

  path       = require('path'),
  webpack    = require('webpack'),
  UglifyJs   = require('uglifyjs-webpack-plugin'),
  HtmlWP     = require('html-webpack-plugin'),
  extract    = require('extract-text-webpack-plugin'),
  compress   = require('compression-webpack-plugin'),
  sprite     = require('webpack-spritesmith'),
  svgSprites = require('svg-spritemap-webpack-plugin'),

  paths = {
    html        : path.resolve(__dirname, 'dev', 'index.html'),
    js          : path.resolve(__dirname, 'dev', 'assets/js/main.js'),
    styl        : path.resolve(__dirname, 'dev', 'assets/stylus/style.styl'),
    bundleCSS   : 'assets/css/',
    bundleJS    : 'assets/js/'
  };


const config = {

  context: path.resolve(__dirname, 'dev'),

  devtool: (!PROD ? 'source-map' : ''),

  entry: [
    paths.js,
    paths.styl
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: paths.bundleJS + 'main.js'
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'dev'),
    publicPath: '/',
    hot: false,
    port: 3000
  },

  plugins: [

    new svgSprites({
      src: path.resolve(__dirname, 'dev', 'assets/images/svg/*.svg'),
      filename: 'assets/images/svg-symbols.svg',
      prefix: '',
      svgo: true,
      chunk: 'svg-symbols'
    }),

    new sprite({
      src: {
        cwd: path.resolve(__dirname, 'dev', 'assets/images/sprite/'),
        glob: '*'
      },
      target: {
        image: path.resolve(__dirname, 'dev', 'assets/images/sprite.png'),
        css: path.resolve(__dirname, 'dev', 'assets/stylus/sprite.styl')
      },
      apiOptions: {
        cssImageRef: '~sprite.png'
      }
    }),

    new HtmlWP({
      template: paths.html,
      minify: PROD ? { collapseWhitespace: true, conservativeCollapse: true, removeComments: true } : {}
    }),

    new extract({
      filename: paths.bundleCSS + 'style.css',
      allChunks: true
    }),

    (PROD ? new UglifyJs() : new webpack.HotModuleReplacementPlugin())


  ],

  module: {

    rules: [

    
      {
        test: /\.(html)$/,
        loader: 'html-loader'
      },


      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['es2015', {
              /***
                (modules: false)
                Faz com que o babel carregue os modulos de maneira estática,
                com isso o uglify js é capaz de efetuar o tree shaking e o dead code elimination
              ***/
              modules: false
            }]
          ]
        },
        exclude: /node_modules/,
      },

      {
        test: /\.styl$/,
        loader: extract.extract({
          use: [
            { 
              loader: 'css-loader',
              options: { minimize: (PROD ? true : false) }
            },
            {
              loader: 'stylus-loader',
              options: {
                use: [jeet(), rupture(), kswiss(), nib()],
              }
            },
          ],
          fallback: 'style-loader',
          publicPath: '../../'
        }),
      },

      (!PROD ?

      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpe?g)$/i,
        use: [
          {
            loader: 'url-loader',
            query: {
              limit: 500,
              name: '[path][name].[ext]'
            }
          }
        ] 
      }

      : 

      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpe?g)$/i,

        use: [
          {
            loader: 'url-loader',
            query: {
              limit: 500,
              name: '[path][name].[ext]'
            }
          },

          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                quality: 80
              }
            }
          }
        ]

      })

    ],
  },

  resolve: {
    extensions: [".js", ".styl"],
    modules: ["node_modules", "images"]
  }

};


module.exports = config;
