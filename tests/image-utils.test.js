import { describe, it, expect } from 'vitest';
import { isBase64Image, getPhotoType } from '../js/image-utils.js';

// Note: compressImage and compressImages require browser APIs (FileReader, Image, Canvas)
// and cannot be tested in Node. We test the pure helper functions here.

describe('isBase64Image', () => {
    it('retorna true para data URL JPEG', () => {
        expect(isBase64Image('data:image/jpeg;base64,/9j/4AAQ...')).toBe(true);
    });

    it('retorna true para data URL PNG', () => {
        expect(isBase64Image('data:image/png;base64,iVBOR...')).toBe(true);
    });

    it('retorna false para URL normal', () => {
        expect(isBase64Image('https://example.com/foto.jpg')).toBe(false);
    });

    it('retorna false para caminho local', () => {
        expect(isBase64Image('fotos/foto1.jpg')).toBe(false);
    });

    it('retorna false para string vazia', () => {
        expect(isBase64Image('')).toBe(false);
    });

    it('retorna false para não-string', () => {
        expect(isBase64Image(123)).toBe(false);
        expect(isBase64Image(null)).toBe(false);
        expect(isBase64Image(undefined)).toBe(false);
    });
});

describe('getPhotoType', () => {
    it('detecta base64', () => {
        expect(getPhotoType('data:image/jpeg;base64,abc123')).toBe('base64');
    });

    it('detecta URL https', () => {
        expect(getPhotoType('https://example.com/foto.jpg')).toBe('url');
    });

    it('detecta URL http', () => {
        expect(getPhotoType('http://example.com/foto.jpg')).toBe('url');
    });

    it('detecta caminho local', () => {
        expect(getPhotoType('Jardim Italamar/foto (1).jpg')).toBe('local');
    });

    it('detecta caminho relativo', () => {
        expect(getPhotoType('./fotos/foto1.jpg')).toBe('local');
    });
});
