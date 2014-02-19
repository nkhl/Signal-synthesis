//defining some globals
var width = 420,
    height = 420,
    aLoop,
    samplesPerSecond = 100,
    speed = 10,
    delta = 0,
    freqs = [0,15,0,0,15,0,0,9,5.25],
    vectors = [[]],
    sampleCount = 100,
    sampleInterval = (width - 40) / sampleCount,
    zoom = 1.5,
    xLineHeight = 0,

    c = document.getElementById('c'),
    ctx = c.getContext('2d'),

    button = document.getElementById("update"),
    freqField = document.getElementById("frequ"),
    zoomField = document.getElementById("zoom"),
    sampleField = document.getElementById("samples"),
    sampleRField = document.getElementById("sample_rate");
    speedField = document.getElementById("speed");

//set canvas size
c.width = width;
c.height = height;

//Fill the canvas with background pattern
function clear()
{
    ctx.fillStyle = 'rgba(180,180,180,1';
    ctx.beginPath();
    ctx.rect(0,0,width,height);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = "rgba(255,0,0,0.4";
    ctx.beginPath();
    ctx.moveTo(20,xLineHeight);
    ctx.lineTo(width-20,xLineHeight);
    ctx.closePath();
    ctx.stroke();

}

//Move points
function movePoints()
{
    for(var i = 0;i<sampleCount - 1; i++)
    {
        vectors[i][0] = vectors[i+1][0];
        vectors[i][1] = vectors[i+1][1];
    }
}

//Add new point
function newPoint()
{
    //Reset the last vector
    vectors[sampleCount - 1][0] = 0;
    vectors[sampleCount - 1][1] = 0;

    //Get new last vector 
    //DC0 on x-axis???
    for(var i = 0;i<freqs.length;i++)
    {
        //X-coordinate
        vectors[sampleCount - 1][0] += freqs[i]*Math.cos(2*Math.PI*i*delta/samplesPerSecond);
        //Y-coordinate
        vectors[sampleCount - 1][1] += freqs[i]*Math.sin(2*Math.PI*i*delta/samplesPerSecond);
    }

    //Move one time unit forward
    delta++; 
}

//Draw lines from sample to next sample
function drawPoints()
{
    var alpha,
        total,
        totalNext;

    for(var i = 0;i<sampleCount - 1; i++)
    {
        if(i<5)
            alpha = (i+1)/6;
        else if(i>sampleCount-5)
            alpha = (sampleCount - (i+1))/6;
        else
            alpha = 0.9;

        //Y increases downwards
        total = -vectors[i][0]*zoom;
        totalNext = -vectors[i+1][0]*zoom;

        ctx.strokeStyle = "rgba(0,0,0,"+alpha+")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20+i*sampleInterval,xLineHeight + total);
        ctx.lineTo(20+(i+1)*sampleInterval,xLineHeight + totalNext);
        ctx.stroke();
        ctx.closePath();
    }
}

function drawCircle()
{
    var circleX = width/4,
        circleY = (height/3)*2,
        circleRadius = 40,
        pX = 0,
        pY = 0,
        cX = 0,
        cY = 0,
        x = 0,
        y = 0,
        amp = 0;

    //Circle
    ctx.strokeStyle = "rgba(0,160,0,0.7)";
    ctx.beginPath();
    ctx.arc(circleX,circleY,circleRadius,0,2*Math.PI,false);
    ctx.closePath();
    ctx.stroke();

    //X-axis
    ctx.strokeStyle = "rgba(160,0,160,0.7)";
    ctx.beginPath();
    ctx.moveTo(circleX-circleRadius,circleY);
    ctx.lineTo(circleX+circleRadius,circleY);
    ctx.closePath();
    ctx.stroke();
    
    //Y-axis
    ctx.beginPath();
    ctx.moveTo(circleX,circleY-circleRadius);
    ctx.lineTo(circleX,circleY+circleRadius);
    ctx.closePath();
    ctx.stroke();

    //Draw each frequency on the circle and collect combined vector
    ctx.strokeStyle = "rgba(0,0,160,0.7)";
    for(var i = 1;i<freqs.length;i++)
    {
        //Frequency is not zero
        if(freqs[i] != 0)
        {
            x = Math.cos(2*Math.PI*i*delta/samplesPerSecond);
            y = Math.sin(2*Math.PI*i*delta/samplesPerSecond);
            
            cX += x;
            cY += y;

            pX = circleX+circleRadius*x;
            pY = circleY+circleRadius*y;

            ctx.beginPath();
            ctx.moveTo(circleX,circleY); 
            ctx.lineTo(pX,pY); 
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = "rgba(200,200,0,1)";
            ctx.beginPath();
            ctx.arc(pX,pY,5,0,2*Math.PI,false);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "Black";
            ctx.fillText(i,pX+12,pY);
        }
    }

    //Draw collective vector
    ctx.strokeStyle = "Red";
    ctx.fillStyle = "rgba(255,255,255,1)";

    ctx.beginPath();
    ctx.moveTo(circleX,circleY);
    ctx.lineTo(circleX+circleRadius*cX,circleY+circleRadius*cY);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(circleX+circleRadius*cX,circleY+circleRadius*cY,5,0,2*Math.PI,true);
    ctx.closePath();
    ctx.fill();


}

function drawTraced()
{
    var posX = 3*width/4,
        posY = 2*height/3,
        scaling = 2.0;
    
    ctx.strokeStyle = "Black";
    ctx.beginPath();
    ctx.moveTo(posX+scaling*vectors[0][0],posY+scaling*vectors[0][1]);

    for(var i = 1;i<sampleCount; i++)
    {
        ctx.lineTo(posX+scaling*vectors[i][0],posY+scaling*vectors[i][1]);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.beginPath();
    ctx.arc(posX+scaling*vectors[sampleCount - 1][0],posY+scaling*vectors[sampleCount - 1][1],3,0,2*Math.PI,false);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,0,0,0.8)";
    ctx.beginPath();
    ctx.moveTo(posX-4,posY-4);
    ctx.lineTo(posX+4,posY+4);
    ctx.moveTo(posX-4,posY+4);
    ctx.lineTo(posX+4,posY-4);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = 1;
}

//Button click handler
function onClick()
{
    //Halt execution
    clearTimeout(aLoop);

    //Get new values for variables
    zoom = zoomField.value;
    sampleCount = sampleField.value;
    samplesPerSecond = sampleRField.value;
    sampleInterval = (width - 40) / sampleCount;
    speed = speedField.value;

    //parse frequencies
    freqs = [];
    var string = freqField.value,
        n = 0;
        newFreqs = string.split(" ");
    for(var i = 0;i<newFreqs.length;i++)
    {
        n = parseFloat(newFreqs[i]);
        
        if(isNaN(n))
            freqs[i] = 0;
        else
            freqs[i] = n;
    }

    //reset
    init();
}
//Bind button to function with eventlistener
button.addEventListener("click",onClick,true);

//Main loop
var AnimLoop = function()
{
    //Logic
    movePoints();
    newPoint();

    //Clear the old frame and draw new
    clear();
    drawPoints();
    drawCircle();
    drawTraced();

    //Print samples processed
    ctx.fillStyle = "White";
    ctx.fillText("SAMPLES  "+delta,10,10);

    //Print current amplitude
    ctx.fillStyle = "Black";
    amp = vectors[sampleCount-1][0];
    ctx.fillText("AMPLITUDE  "+amp,10,20);

    //Print zoom
    ctx.fillStyle = "White";
    ctx.fillText("ZOOM  "+zoom,width - 60,10);

    //Que next frame
    aLoop = setTimeout(AnimLoop, 1000/speed);
};

//Initialization function
function init()
{
    var largestAmp = 0;
    
    //Initialize all vectors
    vectors = new Array(sampleCount);
    for(var i = 0;i<sampleCount; i++)
    {
        vectors[i] = new Array(2);
        vectors[i][0] = 0;
        vectors[i][0] = 1;
    }

    //Get largest amp for x-line offset
    largestAmp = freqs[0];
    for(var i = 0;i<freqs.length;i++)
    {
        if(freqs[i] > largestAmp)
            largestAmp = freqs[i];
    }
    xLineHeight = width/4 - largestAmp/2;

    //Reset time
    delta = 0;

    //Start animation
    AnimLoop();
}

init();


