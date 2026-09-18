package org.zalmoxis.opaque.Exceptions;

public class ResourceNotFoundException
        extends RuntimeException
{
    public ResourceNotFoundException(String message)
    {
        super(message);
    }
}
