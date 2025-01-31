import React, { useState, useRef } from 'react'
import { useFinance } from '../context/FinanceContext'
import { createWorker } from 'tesseract.js'
import Compressor from 'compressorjs'
import { FiUpload, FiImage, FiLoader } from 'react-icons/fi'
import Tooltip from './Tooltip'

const ReceiptUpload = ({ transactionId, onComplete }) => {
  const { dispatch, t } = useFinance()
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef()
  const workerRef = useRef(null)

  const cleanupWorker = async () => {
    if (workerRef.current) {
      try {
        await workerRef.current.terminate()
      } catch (error) {
        console.error('Error terminating worker:', error)
      }
      workerRef.current = null
    }
  }

  const processImage = async (file) => {
    setIsProcessing(true)
    setProgress(0)

    try {
      // First compress the image
      const compressedImage = await new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 1600,
          maxHeight: 1600,
          success: resolve,
          error: reject
        })
      })

      // Convert compressed image to base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(compressedImage)
      })

      // Save the image first
      dispatch({
        type: 'ADD_RECEIPT',
        payload: {
          transactionId,
          imageData: base64Image
        }
      })

      // Initialize worker
      const worker = await createWorker()
      workerRef.current = worker
      
      // Set up progress tracking
      if (worker && worker.logger) {
        worker.logger.progress = (p) => {
          setProgress(Math.round(p * 100))
        }
      }

      // Set parameters and language
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789.,ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$€£¥',
      })

      // Perform OCR
      const { data: { text } } = await worker.recognize(compressedImage)

      // Extract amount and description
      const amountMatch = text.match(/[$€£¥]?\s*\d+[.,]\d{2}/)
      const amount = amountMatch 
        ? parseFloat(amountMatch[0].replace(/[$€£¥\s]/g, '').replace(',', '.'))
        : null

      // Find the longest line that's not just numbers/symbols as potential description
      const lines = text.split('\n')
      const description = lines
        .filter(line => line.length > 5 && !/^[\d\s\W]+$/.test(line))
        .sort((a, b) => b.length - a.length)[0]

      if (onComplete) {
        onComplete({
          amount,
          description: description || ''
        })
      }

    } catch (error) {
      console.error('Error processing receipt:', error)
    } finally {
      await cleanupWorker()
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      await processImage(file)
    }
    event.target.value = null // Reset file input
  }

  return (
    <div className="inline-block">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {isProcessing ? (
        <Tooltip content={`${t('processingReceipt')} ${progress}%`}>
          <div className="flex items-center gap-2 text-blue-600">
            <FiLoader className="w-4 h-4 animate-spin" />
            <span className="text-sm">
              {progress > 0 ? `${progress}%` : t('processingReceipt')}
            </span>
          </div>
        </Tooltip>
      ) : (
        <Tooltip content={t('uploadReceipt')}>
          <button
            onClick={() => fileInputRef.current.click()}
            className="text-blue-600 hover:text-blue-900"
          >
            <FiImage className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
    </div>
  )
}

export default ReceiptUpload
