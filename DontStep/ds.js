import './style.css'
import $ from 'webpack-zepto'
!function(){
    function dontStep(){
        this.speed=4;
        this.score=0;
        this.highest = 0;
        this.init();
        this.startGame();
        this.bindEvent();
        var highestscoreData = this.getHighestScore();
        if(highestscoreData){
            this.highest = JSON.parse(highestscoreData);
        }else{
            this.highest = 0;
        }

        this.setHighest(this.highest)
    }

    dontStep.prototype.startGame=function(){
        var _this=this;
        this.time=setInterval(function(){
            _this.move();
        },30)
    }
    dontStep.prototype.createRow=function(){
        var tpl='	<div class="row">'+
            '<div class="cell"></div>'+
            '<div class="cell"></div>'+
            '<div class="cell"></div>'+
            '<div class="cell"></div>'+
            '</div>';
        $('#con').prepend(tpl);
        var i=Math.floor(Math.random()*4);
        $('#con').first().find('.cell').eq(i).addClass('black');
    }
    dontStep.prototype.init=function(){
        var tpl='	<div class="row">'+
            '<div class="cell"></div>'+
            '<div class="cell"></div>'+
            '<div class="cell"></div>'+
            '<div class="cell"></div>'+
            '</div>';
        $('#con').prepend(tpl);
        for(var i=0;i<4;i++){
            this.createRow();
        }
    }
    dontStep.prototype.move=function(){
        var $con=$('#con');
        var top=$con.css('top');
        var cellWidth = $('.cell').css('width')
        var conWidth = $('#con').css('width')
        top=parseInt(top)+this.speed;
        $con.css('top',top)
        if(top>=0){
            this.createRow();
            $con.css('top',-cellWidth)
        }
        var rowbottom=parseInt($('.row').last().offset().top)+parseInt(cellWidth);
        var conbottom=parseInt($('#main').offset().top)+parseInt(conWidth);
        var rowtop = parseInt($('.row').last().offset().top)
        if(conbottom<=rowbottom){
            var $lastrow = $('#con').find('.row').last().find('.cell')
            if($lastrow.hasClass('black')){
                clearInterval(this.time)
                this.gameOver();
            }else{
                if (rowtop>conbottom)
                    $('#con').find('.row').last().remove()
            }
        }
    }
    dontStep.prototype.gameOver=function(){
        $('.start').hide();
        $('.reStart').show();
        $('#cover').show();
    }
    dontStep.prototype.speedUp=function(){
        if(this.score%10===0&&this.score!==0){
            this.speed+=1;
        }
    }
    dontStep.prototype.scoreUp=function(){
        this.score+=1;
        $('#score').text('总分：'+this.score);
        this.speedUp();
    }
    dontStep.prototype.setHighest=function(highScore){
        $('#highest').text('最高分：'+highScore);
    }
    dontStep.prototype.bindEvent=function(){
        var _this=this;
        $('#con').on('click','.cell',function(){
            if($(this).hasClass('black')&&$('.black').index($(this))+1===$('.black').size()){
                $(this).removeClass('black')
                _this.scoreUp();
                if(_this.score>_this.highest){
                    _this.highest = _this.score;
                    _this.setHighest(_this.highest);
                }
            }else if(!$(this).hasClass('black')){
                clearInterval(_this.time)
                _this.gameOver();
            }
        })
        $('#con').on('tap','.cell',function(){
            if($(this).hasClass('black')&&$('.black').index($(this))+1===$('.black').size()){
                $(this).removeClass('black')
                _this.scoreUp();
                _this.setHighest();
            }else if(!$(this).hasClass('black')){
                clearInterval(_this.time)
                _this.gameOver();
            }
        })
        $('.reStart').on('click',function(e){
            e.preventDefault();
            _this.reStart();
        })
        window.onunload = function(){
            _this.setHighestScore(_this.highest)
        }
    }
    dontStep.prototype.reStart=function(){
        $('.row').each(function(){
            this.remove();
        })
        var cellWidth = $('.cell').css('width')
        $('#con').css('top',-cellWidth)
        this.speed=4;
        this.score=0;
        $('#score').text('总分：'+0);
        this.init();
        this.startGame();
        $('#cover').hide();
    }
    dontStep.prototype.setHighestScore = function(highscore){
        var highscoreData = JSON.stringify(highscore)
        window.localStorage.setItem('highscoreData',highscoreData);
    }
    dontStep.prototype.getHighestScore = function(){
        return window.localStorage.getItem('highscoreData')
    }
    $('.reStart').hide();
    $('.start').on('click',function(e){
        e.preventDefault();
        var game=new dontStep();
        $('#cover').hide();
    })
}()
