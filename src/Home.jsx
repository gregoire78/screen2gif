import React, { useRef, useEffect } from 'react'

function Home() {
    const video = useRef()
    const mediaRecorder = useRef()

    useEffect(() => {
        window.api.desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
            console.log(sources)
            for (const source of sources) {
                if (source.name === 'Screen 1') {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({
                            audio: false,
                            video: {
                                mandatory: {
                                    chromeMediaSource: 'desktop',
                                    chromeMediaSourceId: source.id,
                                    minWidth: 1280,
                                    maxWidth: 1280,
                                    minHeight: 720,
                                    maxHeight: 720
                                }
                            }
                        })
                        handleStream(stream)
                    } catch (e) {
                        console.log(e)
                    }
                    return
                }
            }
        })
    }, [])

    function handleStream(stream) {
        video.current.srcObject = stream
        video.current.onloadedmetadata = (e) => video.current.play()
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = handleDataAvailable;
    }

    let recordedChunks = [];

    function handleDataAvailable(event) {
        console.log("data-available");
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
            console.log(recordedChunks);
            download();
        }
    }

    function download() {
        let blob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        saveBlob(blob)
    }

    function saveBlob(blob) {
        let reader = new FileReader()
        reader.onload = function () {
            if (reader.readyState == 2) {
                let fileName = 'test.webm'
                window.api.ipcRenderer.send("SAVE_FILE", fileName, reader.result)
                console.log(`Saving ${JSON.stringify({ fileName, size: blob.size })}`)
            }
        }
        reader.readAsArrayBuffer(blob)
    }

    return (
        <div>
            <h2>Hello from React!</h2>
            <video width="500" height="400" controls ref={video} />
            <button onClick={() => mediaRecorder.current.start()}>start</button>
            <button onClick={() => mediaRecorder.current.stop()}>stop</button>
        </div>
    )
}

export default Home
