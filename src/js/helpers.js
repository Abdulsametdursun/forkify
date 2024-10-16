import { TIMEOUT_SEC } from './config.js';

/**
 * Timeout function to handle slow API requests
 * @param {number} s - Number of seconds before timing out
 * @returns {Promise} A rejected promise after the timeout duration
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

/**
 * AJAX function to handle both GET and POST requests
 * @param {string} url - The URL to send the request to
 * @param {Object} [uploadData] - Optional data to send for POST requests
 * @returns {Promise<Object>} The response data from the server
 * @throws Will throw an error if the request fails
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
