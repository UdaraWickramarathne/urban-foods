import backupService from '../services/backupService.js';
import HttpStatus from '../enums/httpsStatus.js';
import backupRepository from '../repositories/backupRepository.js';

const createBackup = async (req, res) => {
  try {
    const result = await backupService.createBackup();
    
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        data: {
          id: result.backupId,
          fileName: result.fileName,
          size: result.size,
          createdAt: result.createdAt,
          status: 'Completed'
        },
        message: result.message
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error in createBackup controller:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating database backup'
    });
  }
};

const getAllBackups = async (req, res) => {
  try {
    const result = await backupRepository.getAllBackups();
    
    if (result.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result.data
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error in getAllBackups controller:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error retrieving database backups'
    });
  }
};

const downloadBackup = async (req, res) => {
  try {
    const backupId = req.params.backupId;
    const result = await backupRepository.downloadBackup(backupId);
    
    if (result.success) {
      return res.download(result.filePath, result.fileName, (err) => {
        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error downloading backup file'
          });
        }
      });
    }
  } catch (error) {
    console.error('Error in downloadBackup controller:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Error downloading backup'
    });
  }
};

export default {
  createBackup,
  getAllBackups,
  downloadBackup
};