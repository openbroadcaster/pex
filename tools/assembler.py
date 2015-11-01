#!/usr/bin/env python
import os
import sys
import tempfile
import shutil

try:
  import pysox;
except ImportError:
  print 'requires pysox module';
  sys.exit()

def assemble(ftype,fpath, catfiles):
	d = os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','..','assets/uploads')
	#f = tempfile.NamedTemporaryFile(mode='w+t',dir=d)
	#fname = f.name
        #d = tempfile.mkdtemp()
        fname = os.path.join(d,fpath)
	try:
	  id = pysox.ConcatenateFiles('input',catfiles)
	except:
          print 'Concat fail' 
	   #os.removedirs(d)
	  sys.exit(1);
        #print(id.get_in_signal())
        #print(id.get_out_signal())
        try:
          outfile = pysox.CSoxStream(fname,'w',id.get_out_signal(),fileType=ftype)
          chain = pysox.CEffectsChain(ostream=outfile)
          chain.add_effect(id)
          chain.flow_effects()
	except:
          print 'Write fail' 
	  sys.exit(1);
	#newf = fpath + '/uploads/output2.wav'
	#shutil.move(f,newf)
	#os.removedirs(d)
        outfile.close()
        print 'Success' 
        sys.exit(0);

def main(argv):
  if len(argv) <=3:
      print 'Insufficient parameters'
      sys.exit(1);
  com = argv.pop(0)
  path = argv.pop(0)
  ftype = 'wav'
  return assemble(ftype, path, argv)

if __name__ == '__main__':
  sys.exit(main(sys.argv))


sys.exit();
