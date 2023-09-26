export const generateRhyme = async (note) => {
    try {
        const response = await fetch('https://speech-to-text-back.onrender.com/api/rhyme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ note }),
        });
        if (response.ok) {
            const responseData = await response.json();
            const generatedText = responseData.generatedText;
            return generatedText;
        } else {
            console.error('Failed to generate rhyme on the backend.');
            return null; // Handle the error or return an appropriate value
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null; // Handle the error or return an appropriate value
    }
};

export const generatePoem = async (note) => {
    try {
        const response = await fetch('https://speech-to-text-back.onrender.com/api/poem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ note }),
        });
        if (response.ok) {
            const responseData = await response.json();
            const generatedText = responseData.generatedText;
            return generatedText;
        } else {
            console.error('Failed to generate poem on the backend.');
            return null; // Handle the error or return an appropriate value
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null; // Handle the error or return an appropriate value
    }
};

export const generateHaiku = async (note) => {
    try {
        const response = await fetch('https://speech-to-text-back.onrender.com/api/haiku', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ note }),
        });
        if (response.ok) {
            const responseData = await response.json();
            const generatedText = responseData.generatedText;
            return generatedText;
        } else {
            console.error('Failed to generate haiku on the backend.');
            return null; // Handle the error or return an appropriate value
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null; // Handle the error or return an appropriate value
    }
};

export const generateSong = async (note) => {
    try {
        const response = await fetch('https://speech-to-text-back.onrender.com/api/song', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ note }),
        });
        if (response.ok) {
            const responseData = await response.json();
            const generatedText = responseData.generatedText;
            return generatedText;
        } else {
            console.error('Failed to generate song on the backend.');
            return null; // Handle the error or return an appropriate value
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null; // Handle the error or return an appropriate value
    }
};

export const generateText = async (note) => {
    try {
        const response = await fetch('https://speech-to-text-back.onrender.com/api/whisper', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ note }),
        });
        if (response.ok) {
            const responseData = await response.json();
            const generatedText = responseData.generatedText;
            return generatedText;
        } else {
            console.error('Failed to generate song on the backend.');
            return null; // Handle the error or return an appropriate value
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null; // Handle the error or return an appropriate value
    }
};

