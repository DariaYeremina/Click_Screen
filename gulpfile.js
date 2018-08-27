var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');


gulp.task('sass', function(){
    return gulp.src('app/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.stream());
    //.pipe(browserSync.reload({stream: true}));
})


gulp.task('browserSync', function(){
    browserSync.init({
        server:{
            baseDir:'app'
        },
        port: 8081,
        open: true,
        notify: false
    });
})

gulp.task('img', function(){
    return gulp.src('app/img/*')
    .pipe(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('img/imgmin'))
})

gulp.task('watch', ['browserSync', 'sass'], function(){
	setTimeout(function(){
		gulp.watch('app/scss/*.scss', [sass]);
    gulp.watch('app/*.html', browserSync.reload)
    gulp.watch('app/js/*.js', browserSync.reload)
    gulp.watch('app/libs/*.js', browserSync.reload)
	},1000)
    
})




